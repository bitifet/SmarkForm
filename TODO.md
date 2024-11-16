# TODO

(Unofficial unmantained TODO list)


## Features:

  * Allow for additional (sibling) direct childs in lists as specialized templates
    - They are required to come with "data-smark-template" attribute specifying its function.
    - Functions to implement:
      ✅ "item": Item template (can be ommitted like nowadays).
      ✅ "empty_list": Template to render when the list is empty (⚠️  Disallow if min_items > 0).
      o "separator": Separator template (to be placed in between every pair of items).
      o "last_separator": Like "separator" but only for the last item.
      o "header": To be rendered on top uless empty_list defined and list is empty.
      o "footer": Like header but for the bottom.

  * Implement dependent disabilitation.


## Documentation:

  * Modify examples' tabbed container media=print CSS so that all tabs get printed.
    - NO: But allow to specify a list of tabs to be printed in addition to the selected one.

  * Start pending component type sections redaction by, at least, inserting relevant enhanced examples.
