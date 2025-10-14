# Implementation Notes: Co-Located Custom Tests

## Summary

Successfully implemented co-located custom tests for documentation examples with full support for:
1. Custom test definitions via `tests=` parameter
2. Enforcement that all examples define tests (or explicitly disable with `tests=false`)
3. Expected error counts for examples demonstrating error handling
4. Helper functions for test convenience
5. Automatic migration tool for existing examples

## Changes Made

### Core Implementation

#### 1. Collector Script (`scripts/collect-docs-examples.js`)
- Added support for parsing `tests=` parameter from include blocks
- Resolves test code from capture blocks (like other sources)
- Applies transformations to test code (█ → spaces, $$ → -${formId})
- Handles `tests=false` as a literal string for explicit opt-out
- Sets `tests` to empty string if not provided (for validation)
- Added support for `expectedConsoleErrors` and `expectedPageErrors` parameters
- Parses error count parameters as integers with default value of 0

**Lines changed**: ~25 additions

#### 2. Test Runner (`test/docs_examples.tests.js`)
- Added `helpers` object with `root(page, id)` utility function
- Implements enforcement: fails if tests missing or empty (unless `tests=false`)
- Writes test code to temporary `.mjs` file for dynamic import
- Dynamically imports and executes test modules
- Passes `{ page, expect, id, helpers }` to test functions
- Validates that test module has a default export function
- Checks console and page errors against expected counts
- Improved error messages for better debugging

**Lines changed**: ~70 additions, ~2 modifications

### Documentation

#### 3. Comprehensive User Guide (`CO_LOCATED_TESTS.md`)
- Complete feature documentation
- Examples of all use cases
- API reference for test function parameters
- Migration guide with both automated and manual approaches
- Requirements and benefits clearly stated

**Lines added**: ~142

#### 4. Test Examples (`docs/_test_examples.md`)
- Example with `tests=false`
- Example with custom tests
- Example with expected errors
- Demonstrates all features in working code

**Lines added**: ~99

#### 5. Implementation Summary Updates (`IMPLEMENTATION_SUMMARY.md`)
- Updated collector description with new features
- Updated test harness description with new capabilities
- Added "Co-Located Custom Tests" section
- Updated future enhancements section

**Lines changed**: ~40 additions, ~6 modifications

### Tools and Migration

#### 6. Migration Script (`scripts/add-tests-false-to-examples.js`)
- Automated tool to add `tests=false` to existing examples
- Scans all markdown files in docs/
- Detects includes without tests parameter
- Adds `tests=false` to comply with new requirements
- Provides clear progress output

**Lines added**: ~115

#### 7. Validation Tests (`test/co_located_tests_validation.tests.js`)
- Validates manifest structure
- Ensures all examples have tests property
- Checks that no examples have empty tests
- Validates error count properties exist and are valid
- Tests specific example configurations
- Verifies transformations are applied

**Lines added**: ~108

### Documentation Examples Updates

#### 8. Existing Documentation Files
Updated 11 documentation files with `tests=false`:
- `docs/_about/showcase.md` (22 examples)
- `docs/_component_types/type_color.md` (3 examples)
- `docs/_component_types/type_date.md` (2 examples)
- `docs/_component_types/type_form.md` (1 example)
- `docs/_component_types/type_label.md` (3 examples)
- `docs/_component_types/type_list.md` (4 examples)
- `docs/_component_types/type_number.md` (2 examples)
- `docs/_getting_started/core_component_types.md` (6 examples)
- `docs/_getting_started/core_concepts.md` (6 examples)
- `docs/_getting_started/quick_start.md` (13 examples)
- `docs/index.md` (1 example)

**Total examples updated**: 63

## File Statistics

```
18 files changed
658+ insertions
10- deletions
```

## Key Features Implemented

### 1. Co-Located Test Definitions ✅
- Tests defined in Jekyll capture blocks
- Referenced via `tests=capture_name` parameter
- Full ES module support with async/await
- Access to Playwright page and expect APIs

### 2. Test Enforcement ✅
- All examples MUST define tests property
- Can be custom tests or `tests=false`
- Clear error messages when missing
- Validation tests to catch issues early

### 3. Helper Functions ✅
- `helpers.root(page, id)` → locator for form root element
- Easy to extend with more helpers in future

### 4. Expected Error Counts ✅
- `expectedConsoleErrors` parameter
- `expectedPageErrors` parameter
- Allows examples to demonstrate error handling
- Tests fail if actual errors don't match expected

### 5. Transformations ✅
- Same transformations as other sources
- █ → 4 spaces (indentation)
- $$ → -${formId} (ID suffix)
- Applied to test code automatically

### 6. Migration Support ✅
- Automated script for bulk updates
- Clear documentation for manual updates
- All existing examples updated

## Testing Strategy

### Validation Tests
- Manifest structure validation
- Tests presence enforcement validation
- Error count property validation
- Example-specific configuration tests
- Transformation verification

### Integration Tests
The existing `test/docs_examples.tests.js` now:
1. Runs smoke tests (as before)
2. Enforces tests presence
3. Executes custom tests when defined
4. Validates error counts

## Usage Examples

### Example 1: Simple form with tests disabled
```markdown
{% include components/sampletabs_tpl.md
    formId="simple_form"
    htmlSource=simple_form_html
    tests=false
%}
```

### Example 2: Interactive example with custom tests
```markdown
{% capture my_tests %}
export default async ({ page, expect, id, helpers }) => {
  const root = helpers.root(page, id);
  await expect(root).toBeVisible();
  
  const addButton = page.getByRole('button', { name: '➕' });
  await addButton.click();
  
  const items = page.locator('.list-item');
  await expect(items).toHaveCount(1);
};
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="interactive_list"
    htmlSource=list_html
    tests=my_tests
%}
```

### Example 3: Error handling demonstration
```markdown
{% include components/sampletabs_tpl.md
    formId="error_demo"
    htmlSource=error_html
    jsSource=error_js
    tests=error_tests
    expectedConsoleErrors=1
%}
```

## Benefits

1. **Single Source of Truth**: Tests live with examples in documentation
2. **Better Test Coverage**: Can test interactive behavior, not just smoke
3. **Documentation Accuracy**: Examples continuously validated
4. **Maintainability**: Changes to examples automatically update tests
5. **Clear Requirements**: Enforcement ensures all examples are testable
6. **Error Testing**: Can document and test error scenarios
7. **Developer Experience**: Clear helpers and good error messages

## Migration Path

For existing installations:
1. Pull the changes
2. Run `node scripts/collect-docs-examples.js`
3. Tests will pass (all examples now have `tests=false`)
4. Gradually add custom tests to interactive examples
5. Update `tests=false` to custom test code as needed

## Technical Notes

### Dynamic Import
- Test code written to temporary `.mjs` file
- Uses `file://` URL for dynamic import
- Clean up after test execution
- ES module format required for test code

### Error Handling
- Clear error messages when tests missing
- Validates test module structure
- Reports both expected and actual error counts
- Helpful hints in error messages

### Transformations
- Applied in same order as other sources
- Consistent behavior across all content types
- Documented in CO_LOCATED_TESTS.md

## Future Enhancements

Possible additions (not implemented):
- Visual regression testing support
- Accessibility testing integration
- Performance benchmarking
- State snapshot testing
- More helper functions as needed

## Compliance with Requirements

✅ Co-located custom tests via tests= parameter
✅ Enforce tests presence/validity
✅ Support for expected error counts
✅ Helper functions (helpers.root)
✅ Test module dynamic import
✅ Transformations applied
✅ Clear documentation
✅ Migration support
✅ All examples updated

## Notes

- All changes follow the "minimal modifications" principle
- Backwards compatible (existing examples work with tests=false)
- Infrastructure ready for future custom test development
- Validation tests ensure ongoing compliance
- Clear error messages guide users to correct usage
