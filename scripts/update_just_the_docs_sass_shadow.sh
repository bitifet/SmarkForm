#!/usr/bin/env bash
#
# Builds the "modern Sass shadow" layer for the just-the-docs theme.
#
# just-the-docs (any released version, including 0.12.0 and upstream main)
# still uses deprecated global Sass functions in a handful of files, which
# produce deprecation warnings under Dart Sass:
#
#   [color-functions]  darken()/lighten()  ->  color.adjust()
#   [global-builtin]   map-get()/map-keys()/length()/variable-exists()
#                      ->  map.get()/map.keys()/list.length()/meta.variable-exists()
#
# Upstream can't merge the darken fix (PR #1548) because pages-gem users lack
# the sass:color module, so this project patches its own copies here.
#
# Jekyll adds the site's `_sass/` directory to the Sass load path BEFORE the
# theme's `_sass`, so same-named files shadow the theme's originals.
#
# Three kinds of shadows:
#  - PATCHED: copies of the theme files rewritten with module-scoped functions
#    (+ the matching `@use "sass:..."` as the first statement).
#  - REDIRECT: import-chain files that must live in the site tree so that the
#    relative imports leading to a PATCHED file resolve to the site copy.
#    They use load-path-relative @import paths ("support/variables") instead
#    of the theme's "./variables", so unshadowed siblings still resolve to
#    the theme via the load path.
#  - VERBATIM: files copied unchanged because their relative imports already
#    fall back to the theme for unshadowed siblings.
#
# To rebuild:  bash scripts/update_just_the_docs_sass_shadow.sh
set -euo pipefail

# Works from the repo root or from docs/.
if [ -f "Gemfile" ] && grep -q 'just-the-docs' "Gemfile" 2>/dev/null; then
  cd ..
fi

GEM_PATH="$(cd docs && bundle exec ruby -e 'puts Gem::Specification.find_by_name("just-the-docs").full_gem_path')"
THEME_DIR="$GEM_PATH/_sass"
SITE_SASS="docs/_sass"

# Files copied unchanged (see header).
VERBATIM=(
  "modules.scss"
)

# Import-chain files rewritten with explicit load-path-relative @import, so
# unshadowed siblings resolve to the theme via the load path while patched
# siblings resolve to the site copy. Mirrors the theme's import lists.
REDIRECT=(
  "support/support.scss"
  "support/mixins/mixins.scss"
  "utilities/utilities.scss"
)

# Files patched with modern functions. Each entry is "rel:uses" where "uses"
# is the space-separated list of sass modules to @use.
PATCHED=(
  "buttons.scss:sass:color"
  "support/mixins/_buttons.scss:sass:color"
  "color_schemes/light.scss:sass:color"
  "color_schemes/dark.scss:sass:color"
  "support/_variables.scss:sass:map"
  "support/mixins/_layout.scss:sass:map"
  "utilities/_layout.scss:sass:map sass:list"
  "utilities/_spacing.scss:sass:map sass:list"
  "layout.scss:sass:meta"
  "code.scss:sass:meta"
)

mkdir -p "$SITE_SASS/support/mixins" "$SITE_SASS/color_schemes" "$SITE_SASS/utilities"

for rel in "${VERBATIM[@]}"; do
  mkdir -p "$SITE_SASS/$(dirname "$rel")"
  cp "$THEME_DIR/$rel" "$SITE_SASS/$rel"
  echo "verbatim  $rel"
done

for rel in "${REDIRECT[@]}"; do
  mkdir -p "$SITE_SASS/$(dirname "$rel")"
  out="$SITE_SASS/$rel"
  case "$rel" in
    "support/support.scss")
      cat > "$out" <<'EOF'
// Shadow of just-the-docs support/support.scss. Relative imports rewritten as
// load-path-relative so unshadowed siblings resolve to the theme gem.
@import "support/variables";
@import "support/mixins/mixins";
EOF
      ;;
    "support/mixins/mixins.scss")
      cat > "$out" <<'EOF'
// Shadow of just-the-docs support/mixins/mixins.scss. Load-path-relative
// imports: "buttons" resolves to the site's patched _buttons.scss first.
@import "support/mixins/layout";
@import "support/mixins/buttons";
@import "support/mixins/typography";
EOF
      ;;
    "utilities/utilities.scss")
      cat > "$out" <<'EOF'
// Shadow of just-the-docs utilities/utilities.scss. Load-path-relative
// imports: "layout" and "spacing" resolve to the site's patched copies.
@import "utilities/colors";
@import "utilities/layout";
@import "utilities/typography";
@import "utilities/lists";
@import "utilities/spacing";
EOF
      ;;
  esac
  echo "redirect  $rel"
done

for entry in "${PATCHED[@]}"; do
  rel="${entry%%:*}"
  mods="${entry#*:}"
  mkdir -p "$SITE_SASS/$(dirname "$rel")"
  out="$SITE_SASS/$rel"
  perl -pe '
    s/\bdarken\(([^,]+),\s*([0-9.]+)%\)/color.adjust($1, \$lightness: -$2%)/g;
    s/\blighten\(([^,]+),\s*([0-9.]+)%\)/color.adjust($1, \$lightness: $2%)/g;
    s/\bmap-get\(/map.get(/g;
    s/\bmap-keys\(/map.keys(/g;
    s/\blength\(\$spacers\)/list.length(\$spacers)/g;
    s/\bvariable-exists\(/meta.variable-exists(/g;
  ' "$THEME_DIR/$rel" > "$out"
  # Insert @use blocks as the first statement (before any @import).
  uses=""
  for m in $mods; do
    uses="${uses}@use \"$m\";"$'\n'
  done
  tmp="$out.tmp"
  printf '%b' "$uses" > "$tmp"
  cat "$out" >> "$tmp"
  mv "$tmp" "$out"
  echo "patched   $rel ($mods)"
done

echo "done."