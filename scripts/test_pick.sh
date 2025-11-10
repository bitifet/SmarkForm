#!/usr/bin/env bash
#
# Interactive selector for running Playwright tests.
# - Uses dialog for interactive menus
# - Uses node to parse playwright.config.js projects
# - Uses jq to parse test/.cache/docs_examples.json
#
# Features:
# - Choose browser (project) from playwright.config.js
# - Choose between regular tests and co-located tests
# - Choose a test implementation file (regular tests) or use co_located_tests.tests.js
# - Choose the documentation markdown file (unique files from docs_examples.json)
# - Choose the formId (test id) for the selected markdown file
# - Builds a playwright command like:
#     npx playwright test -- --project=firefox -g ' 2nd_level_hotkeys$' test/co_located_tests.tests.js _about/showcase.md
# - Saves the last built command to test/.cache/last_playwright_cmd.sh
# - Supports:
#     --repeat (direct re-run of last saved command)
#     Menu "Repeat last choice" (edit last saved command before running)
#
# Usage:
#   ./test_pick.sh          # run the interactive picker and execute the selected command
#   ./test_pick.sh --repeat # re-run the last saved command (from test/.cache/last_playwright_cmd.sh)
#
set -euo pipefail

# Helper: die with message
die() {
  echo "Error: $*" >&2
  exit 1
}

# Check arguments
REPEAT_MODE=0        # --repeat flag (direct execute last command)
EDIT_LAST_MODE=0     # menu option (edit then execute)
SKIP_SELECTION=0     # skip building a new command when editing last

if [ "$#" -gt 0 ]; then
  if [ "$1" = "--repeat" ]; then
    REPEAT_MODE=1
    # ignore remaining args for now
  fi
fi

# Ensure script is executed from repo root (we assume this file is in repo root)
# Determine REPO_ROOT as the parent directory of the one containing this script
SCRIPT_DIR=$(dirname "${0}")
REPO_ROOT=$(realpath "${SCRIPT_DIR}/..")
TEST_DIR="$REPO_ROOT/test"
DOCS_CACHE_DIR="$TEST_DIR/.cache"
DOCS_EXAMPLES="$DOCS_CACHE_DIR/docs_examples.json"
LAST_CMD_FILE="$DOCS_CACHE_DIR/last_playwright_cmd.sh"
CONFIG_FILE="$REPO_ROOT/playwright.config.js"
CO_LOCATED_TEST="$TEST_DIR/co_located_tests.tests.js"

# Check required external tools
REQUIRED_TOOLS=(node jq dialog)
MISSING=()
for t in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "$t" >/dev/null 2>&1; then
    MISSING+=("$t")
  fi
done
if [ "${#MISSING[@]}" -ne 0 ]; then
  echo "Missing required tools: ${MISSING[*]}" >&2
  echo "Please install them (e.g. npm/yum/apt) and re-run." >&2
  exit 2
fi

# Verify repo expected files/dirs
[ -f "$CONFIG_FILE" ] || die "Missing $CONFIG_FILE in repo root."
[ -d "$TEST_DIR" ] || die "Missing test/ directory at $TEST_DIR."
[ -f "$DOCS_EXAMPLES" ] || die "Missing $DOCS_EXAMPLES (ensure your pretest step populated it)."
[ -f "$CO_LOCATED_TEST" ] || die "Missing co-located tests file: $CO_LOCATED_TEST"

# 1) Read projects (browser names) from playwright.config.js using node
mapfile -t PROJECTS_ARRAY < <(
  awk '/projects:/{found=1} found' "$CONFIG_FILE" \
    | grep "name:" \
    | perl -pe "s/^.*?'(.*?)'.*$/\\1/"
)
[ "${#PROJECTS_ARRAY[@]}" -gt 0 ] || die "Failed to parse projects from $CONFIG_FILE."

# If --repeat requested: try to run last saved command; if not found, warn and go to picker
if [ "$REPEAT_MODE" -eq 1 ]; then
  if [ -f "$LAST_CMD_FILE" ]; then
    # shellcheck source=/dev/null
    source "$LAST_CMD_FILE"
    [ -n "${SAVED_CMD:-}" ] || die "Saved command file malformed."
    echo "Re-running last saved command:"  
    echo "$SAVED_CMD"  
    eval "$SAVED_CMD"
    exit $?
  else
    # Show warning then continue to picker
    dialog --msgbox "No last command found. You'll be returned to the main menu." 7 70 || true
    REPEAT_MODE=0
  fi
fi

# Operation Mode picker (loop to support cancel from edit returning to picker)
BROWSER_CHOICE=""
CMD=""
while true; do
  # Build dialog menu entries for projects: tag item tag item ...
  PROJECT_MENU_ARGS=()
  PROJECT_MENU_ARGS+=("LAST" "Repeat last choice (edit before run)")
  for p in "${PROJECTS_ARRAY[@]}"; do
    PROJECT_MENU_ARGS+=("$p" "Test with $p")
  done
  PROJECT_MENU_ARGS+=("ALL" "Test with all")

  exec 3>&1
  BROWSER_SELECTION=$(dialog --clear --backtitle "Playwright Test Picker" \
    --title "Operation Mode" \
    --menu "Select an option:" 15 60 10 \
    "${PROJECT_MENU_ARGS[@]}" \
    2>&1 1>&3)
  STATUS=$?
  exec 3>&-

  if [ $STATUS -ne 0 ]; then
    # Cancel exits script for this menu
    exit 0
  fi

  if [ "$BROWSER_SELECTION" = "ALL" ]; then
    BROWSER_CHOICE=""
    break
  elif [ "$BROWSER_SELECTION" = "LAST" ]; then
    # Load and edit last command; if not present, start with empty
    INITIAL_CMD=""
    if [ -f "$LAST_CMD_FILE" ]; then
      # shellcheck source=/dev/null
      source "$LAST_CMD_FILE" || true
      INITIAL_CMD="${SAVED_CMD:-}"
    fi
    exec 3>&1
    EDITED_CMD=$(dialog --clear --backtitle "Playwright Test Picker" \
      --title "Edit last command" \
      --inputbox "Edit the last saved Playwright command, then press OK to run:" 15 100 "$INITIAL_CMD" \
      2>&1 1>&3)
    EDIT_STATUS=$?
    exec 3>&-

    if [ $EDIT_STATUS -ne 0 ]; then
      # Cancel: return to Operation Mode picker
      continue
    fi
    if [ -z "$EDITED_CMD" ]; then
      dialog --msgbox "Command cannot be empty. Returning to main menu." 7 70 || true
      continue
    fi

    CMD="$EDITED_CMD"
    EDIT_LAST_MODE=1
    SKIP_SELECTION=1
    break
  else
    BROWSER_CHOICE="--project=${BROWSER_SELECTION}"
    break
  fi

done

# If we didn't edit last command, continue the normal flow to build the command
if [ "$SKIP_SELECTION" -eq 0 ]; then
  # 2) Ask regular vs co-located
  exec 3>&1
  TEST_TYPE=$(dialog --clear --backtitle "Playwright Test Picker" \
    --title "Test Type" \
    --menu "Run regular tests or co-located tests?" 10 60 4 \
    "regular" "Regular tests (individual .tests.js files)" \
    "colocated" "Co-located tests (co_located_tests.tests.js)" \
    2>&1 1>&3)
  STATUS=$?
  exec 3>&-
  if [ $STATUS -ne 0 ]; then
    exit 0
  fi

  # 3) If regular: list *.tests.js files in test/ (exclude co_located_tests.tests.js)
  if [ "$TEST_TYPE" = "regular" ]; then
    mapfile -t TEST_FILE_BASENAMES < <(find "$TEST_DIR" -maxdepth 1 -type f -name '*.tests.js' ! -name 'co_located_tests.tests.js' -printf '%f\n' | sort)
    if [ "${#TEST_FILE_BASENAMES[@]}" -eq 0 ]; then
      die "No regular .tests.js files found in $TEST_DIR."
    fi
    TEST_MENU_ARGS=()
    for f in "${TEST_FILE_BASENAMES[@]}"; do
      TEST_MENU_ARGS+=("$f" "$f")
    done
    exec 3>&1
    CHOSEN_TEST_BASENAME=$(dialog --clear --backtitle "Playwright Test Picker" \
      --title "Select Test Implementation File" \
      --menu "Select a test implementation file:" 20 80 12 \
      "${TEST_MENU_ARGS[@]}" \
      2>&1 1>&3)
    STATUS=$?
    exec 3>&-
    if [ $STATUS -ne 0 ]; then
      exit 0
    fi
    TEST_IMPL_PATH="$TEST_DIR/$CHOSEN_TEST_BASENAME"

    CMD="npx playwright test ${*} ${BROWSER_CHOICE} \"${TEST_IMPL_PATH}\""

  else
    # co-located
    TEST_IMPL_PATH="$CO_LOCATED_TEST"

    mapfile -t MD_FILES_ARRAY < <(jq -r '.[].file' "$DOCS_EXAMPLES" | sort -u)
    if [ "${#MD_FILES_ARRAY[@]}" -eq 0 ]; then
      die "No markdown files found in $DOCS_EXAMPLES."
    fi
    MD_MENU_ARGS=()
    for m in "${MD_FILES_ARRAY[@]}"; do
      MD_MENU_ARGS+=("$m" "$m")
    done
    exec 3>&1
    CHOSEN_MD_FILE=$(dialog --clear --backtitle "Playwright Test Picker" \
      --title "Select Documentation File (markdown)" \
      --menu "Select a documentation (markdown) file:" 20 80 12 \
      "${MD_MENU_ARGS[@]}" \
      2>&1 1>&3)
    STATUS=$?
    exec 3>&-
    if [ $STATUS -ne 0 ]; then
      exit 0
    fi

    mapfile -t FORM_IDS_ARRAY < <(jq -r --arg f "$CHOSEN_MD_FILE" '.[] | select(.file == $f) | .formId' "$DOCS_EXAMPLES" | grep -v '^null$' | sort -u)
    if [ "${#FORM_IDS_ARRAY[@]}" -eq 0 ]; then
      die "No formId entries found in $DOCS_EXAMPLES for file '$CHOSEN_MD_FILE'."
    fi
    FORM_MENU_ARGS=()
    for id in "${FORM_IDS_ARRAY[@]}"; do
      FORM_MENU_ARGS+=("$id" "$id")
    done
    exec 3>&1
    CHOSEN_FORM_ID=$(dialog --clear --backtitle "Playwright Test Picker" \
      --title "Select formId (test id)" \
      --menu "Select a formId (test identifier) from the selected markdown file:" 20 80 12 \
      "${FORM_MENU_ARGS[@]}" \
      2>&1 1>&3)
    STATUS=$?
    exec 3>&-
    if [ $STATUS -ne 0 ]; then
      exit 0
    fi

    GREP_PATTERN=" \[${CHOSEN_MD_FILE}\] ${CHOSEN_FORM_ID}$"
    CMD="npx playwright test ${*} ${BROWSER_CHOICE} -g '${GREP_PATTERN}' \"${TEST_IMPL_PATH}\" \"${CHOSEN_MD_FILE}\""
  fi
fi

# Ensure cache dir exists before saving
mkdir -p "$DOCS_CACHE_DIR"

# Save the command to last_playwright_cmd.sh as a variable SAVED_CMD so it can be sourced later.
{
  echo "# Last saved Playwright command (generated by test_pick.sh)"
  echo "# DO NOT EDIT unless you know what you're doing."
  printf "SAVED_CMD=%s\n" "$(printf %q "$CMD")"
} > "$LAST_CMD_FILE"
chmod 0644 "$LAST_CMD_FILE"

# Show and run
clear
echo "About to run:"
echo
echo "$CMD"
echo

# Execute the command
eval "$CMD"
EXIT_STATUS=$?

# Exit with the test command's exit code
exit $EXIT_STATUS
