Testing TODO List
=================

(If tests not yet implemented, having them listed will, at least, help in
 remembering to check...)


Co-located Tests for Documentation Examples
-------------------------------------------

Remove `tests=false` from documentation examples and add custom tests unless
not appropriate.

Files to review::
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


Miscellaneous Tests
-------------------

  * Check that form does not get focused at render time.


List component type
-------------------

  * Check list's "count" action triggers to be updated.

  * Check list's addItem and removeItem triggers to be non navegable.


Number component type
---------------------

  * Check import coercion.

  * Check it exports number.

  * Check works as singleton.


Date component type
-------------------

  * Check import coercion.

  * Check it exports valid ISO Date.

  * Check works as singleton.





