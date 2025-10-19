# SmarkForm Documentation Site

> **Note**: This README is about setting up and building the SmarkForm
> documentation website. If you're looking for information about **using
> SmarkForm** itself, please see the main documentation at
> [index.md](index.md).


## Documentation Source

Documentation source can be found in [/docs](/docs) directory of this
repository.

It uses [Jekyll](https://jekyllrb.com/) and
[just-the-docs](https://just-the-docs.github.io/just-the-docs/) Jekyll layout
and it is automatically deployed by GitHub infrastructure anytime new revision
is pushed..


## Documentation Building

To build SmarkForm documentation localloy you first need to install follow this
instructions:

  * [Install Jekyll prerequisites](https://jekyllrb.com/docs/installation/)

  * Execute `gem install jekyll bundler`.

  * Run `npm run doc`.

Then you will be able to see the documentation at `http://localhost:4000` or
`http://<your-ip>:4000`.


## Code Snippets

Code snippets included in the documentation are defined inline through Jekyll
`{% capture %}` blocks and then included in the documentation. They are
rendered by including the `docs/_includes/components/sampletabs_tpl.md`.

> 📌 For this to work, also the file
> `docs/_includes/components/sampletabs_ctrl.md` need to be included earlier in
> the document (typically at the begginning of the file).

Parameters supported by `sampletabs_tpl.md` include:

  * formId (mandatory): Id to insert as "-suffix" in all "$$" hooks;
  * htmlSource (mandatory)
  * cssSource
  * jsHead: JS initialization code.
  * jsHidden: JS source already discussed (not shown in the "JS Source" tab).
  * jsSource: Actual JS example code to be rendered in the "JS Source" tab.
  * notes: Optional notes for further clarifications.
  * selected: Default selected tab (defaults to "html").
  * showEditor: Whether to show the editor textarea or not (defaults to false)
  * showEditorSource: Whether to show or not the Editor implementation (defaults to false)
  * addLoadSaveButtons: Whether to add the "Load" and "Save" buttons (defaults to false)

Every example automaically includes a JavaScript line to enhance a form with
predefined `formId` So that *jsSource* can be omitted for simple examples.

This means that, for introductory examples that don't have to be enhanced as
SmarkForm forms, *jsSource* should be set to `-` to explicitly disable
SmarkForm enhancement.


## Smoke Tests for Documentation Examples

All documentation examples are automatically collected and tested through a
custom test suite.

Smoke tests are automatically performed for all documentation examples to ensure
that they render without errors.

The only exceptions are examples that explicitly disables SmarkForm
enhancenment by setting `jsSource="-"` in the include block.

For more information about the implementation of the test suite, please see
[WRITING_TESTS.md](WRITING_TESTS.md).


## Co-Located Custom Tests

Additionally, documentation examples are expected to include co-located custom
tests to validate their specific behavior.

Those tests are defined inline in the documentation using Jekyll
`{% capture %}` blocks and then referenced in the `tests=` parameter of the
`sampletabs_tpl.md` include.

In case of examples that don't need custom tests (e.g., simple illustrative
examples or some that could be repetitive), tests can be explicitly disabled by
setting `tests=false` in the include block.

For a detailed explanation of how to write co-located custom tests, please see
[CO_LOCATED_TESTS.md](CO_LOCATED_TESTS.md).




