# TODO

(Unofficial unmantained TODO list)


## Features:

  * Implement (preliminar) 'select' component type.
    - Define a 'data-type' property with (at least) following values:
      o "text" (default): Regular text.
      o "json": JSON string.
      o "number": Number (Almost like "json", but restricted to numbers).
    - Make import() and export() actions to handle values accordingly.
    - Options without value attribute should evaluate to their content as text
      no matter the value of `data-type` property.
    - Example:
      ```html
      <select data-smark=`{"data-type": "json"}'>
        <option value='null'>-- Please Select --</option>  <!-- Null -->
        <option value='"option_1"'>Option 1</option>       <!-- "option_1" -->
        <option>Option 2</option>                          <!-- "Option 2" -->
      </select>
      ```

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

  * Implement multiforms.
    - Likewise dependent disabilitation, but more handy in case of very different subforms.

## Documentation:

  * Modify examples' tabbed container media=print CSS so that all tabs get printed.
    - NO: But allow to specify a list of tabs to be printed in addition to the selected one.

  * Start pending component type sections redaction by, at least, inserting relevant enhanced examples.
