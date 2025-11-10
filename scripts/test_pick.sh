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
# - Supports --repeat to re-run the last saved command
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
REPEAT_MODE=0       # --repeat flag behaviour (execute last command directly)
EDIT_LAST_MODE=0    # Menu option "Repeat last choice" behaviour (edit then run)
SKIP_SELECTION=0    # When editing last command we skip further test picking steps
if [ "">${#}" -gt 0 ]; then
    if [ "$1" = "--repeat" ]; then
        REPEAT_MODE=1
        # Rest of arguments will be ignored
    fi
    # Else they will be passed to the playwright command later
fi

# Ensure script is executed from repo root (we assume this file is in repo root)
# Determine REPO_ROOT as the parent directory of the one containing this script
SCRIPT_DIR=$(dirname "${0}");
REPO_ROOT=$(realpath "${SCRIPT_DIR}/..");
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
    cat "${CONFIG_FILE}" \
        | awk '/projects:/{found=1} found' \
        | grep name: \
        | perl -pe "s/^.*?'(.*?)'.*$/\\1/" \
);

if [ "${PIPESTATUS[1]:-0}" -ne 0 ] || [ "${#PROJECTS_ARRAY[@]}" -eq 0 ]; then
  die "Failed to parse projects from $CONFIG_FILE or no projects found."
fi

if [ "$REPEAT_MODE" -eq 0 ]; then

    # Build dialog menu entries for projects: "tag value tag value ..."
    # dialog menu expects pairs: tag item
    PROJECT_MENU_ARGS=()

    # Prepend "Repeat last choice"
    PROJECT_MENU_ARGS=("LAST" "Repeat last choice (edit & run last command)")

    for p in "${PROJECTS_ARRAY[@]}"; do
      # use same string for tag and display
      PROJECT_MENU_ARGS+=("$p" "Test with $p")
    done

    # Append "Test with all"
    PROJECT_MENU_ARGS+=("ALL" "Test with all")

    # Dialog to select browser/project
    exec 3>&1
    BROWSER_CHOICE=$(dialog --clear --backtitle "Playwright Test Picker" \
      --title "Operation Mode" \
      --menu "Select an option:" 15 60 10 \
      "${PROJECT_MENU_ARGS[@]}" \
      2>&1 1>&3)
    exec 3>&-
    if [ -z "">${BROWSER_CHOICE:-} ]; then
      die "No option selected."
    fi

    if [ "${BROWSER_CHOICE}" =  "ALL" ]; then
        BROWSER_CHOICE=""
    elif [ "${BROWSER_CHOICE}" = "LAST" ]; then
        EDIT_LAST_MODE=1
        SKIP_SELECTION=1
    else
        BROWSER_CHOICE="--project=${BROWSER_CHOICE}"
    fi
fi;

# If --repeat requested: run last saved command (unchanged behaviour)
if [ "$REPEAT_MODE" -eq 1 ]; then
  if [ ! -f "$LAST_CMD_FILE" ]; then
    die "No last command saved ($LAST_CMD_FILE). Run the picker first."
  fi
  # shellcheck source=/dev/null
  source "$LAST_CMD_FILE"
  if [ -z "">${SAVED_CMD:-} ]; then
    die "Saved command file malformed."
  fi
  echo "Re-running last saved command:"\n"$SAVED_CMD"
  eval "$SAVED_CMD"
  exit $?
fi

# If menu Repeat last choice chosen: allow editing the command before running
if [ "$EDIT_LAST_MODE" -eq 1 ]; then
  if [ ! -f "$LAST_CMD_FILE" ]; then
    die "No last command saved ($LAST_CMD_FILE). Run the picker first."
  fi
  # shellcheck source=/dev/null
  source "$LAST_CMD_FILE"
  if [ -z "">${SAVED_CMD:-} ]; then
    die "Saved command file malformed."
  fi
  exec 3>&1
  EDITED_CMD=$(dialog --clear --backtitle "Playwright Test Picker" \
    --title "Edit last command" \
    --inputbox "Edit the last saved Playwright command, then press OK to run:" 15 100 "$SAVED_CMD" \
    2>&1 1>&3)
  EDIT_STATUS=$?
  exec 3>&-
  if [ $EDIT_STATUS -ne 0 ]; then
    echo "Aborted."; exit 0
  fi
  [ -n "">${EDITED_CMD:-} ] || die "Empty command after edit."
  CMD="$EDITED_CMD"
fi

if [ $SKIP_SELECTION -eq 0 ]; then
  # 2) Ask regular vs co-located
  exec 3>&1
  TEST_TYPE=$(dialog --clear --backtitle "Playwright Test Picker" \
    --title "Test Type" \
    --menu "Run regular tests or co-located tests?" 10 60 4 \
    "regular" "Regular tests (individual .tests.js files)" \
    "colocated" "Co-located tests (co_located_tests.tests.js)" \
    2>&1 1>&3)
  exec 3>&-
  if [ -z "">${TEST_TYPE:-} ]; then
    die "No test type selected."
  fi

  # 3) If regular: list *.tests.js files in test/ (exclude co_located_tests.tests.js)
  if [ "$TEST_TYPE" = "regular" ]; then
    # Collect files
    mapfile -t TEST_FILE_BASENAMES < <(find "$TEST_DIR" -maxdepth 1 -type f -name '*.tests.js' ! -name 'co_located_tests.tests.js' -printf '%f\n' | sort)
    if [ "${#TEST_FILE_BASENAMES[@]}" -eq 0 ]; then
      die "No regular .tests.js files found in $TEST_DIR."
    fi
    # Build menu args
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
    exec 3>&-
    [ -n "">${CHOSEN_TEST_BASENAME:-} ] || die "No test file selected."
    TEST_IMPL_PATH="$TEST_DIR/$CHOSEN_TEST_BASENAME"

    CMD="npx playwright test ${@} ${BROWSER_CHOICE} \"${TEST_IMPL_PATH}\""
  else
    # co-located
    TEST_IMPL_PATH="$CO_LOCATED_TEST"

    # 4) List unique markdown 'file' values from docs_examples.json
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
    exec 3>&-
    [ -n "">${CHOSEN_MD_FILE:-} ] || die "No markdown file selected."

    # 5) Extract formId values for the chosen markdown file
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
    exec 3>&-
    [ -n "">${CHOSEN_FORM_ID:-} ] || die "No formId selected."

    GREP_PATTERN=" \[${CHOSEN_MD_FILE}\] ${CHOSEN_FORM_ID}$"
    CMD="npx playwright test ${@} ${BROWSER_CHOICE} -g '${GREP_PATTERN}' \"${TEST_IMPL_PATH}\" \"${CHOSEN_MD_FILE}\""
  fi
fi

# Ensure cache dir exists before saving
mkdir -p "$DOCS_CACHE_DIR"

# Save the command to last_playwright_cmd.sh as a variable SAVED_CMD so it can be sourced by --repeat mode.
printf '%s\n' "# Last saved Playwright command (generated by test_pick.sh)" > "$LAST_CMD_FILE"
printf '%s\n' "# DO NOT EDIT unless you know what you're doing." >> "$LAST_CMD_FILE"
printf "SAVED_CMD=%s\n" "$(printf %q "$CMD")" >> "$LAST_CMD_FILE"
chmod 0644 "$LAST_CMD_FILE"

# 7) Show the final command and run it
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
