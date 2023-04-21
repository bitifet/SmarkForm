
TO-DO List
==========

  👉 Implement anchor components (not exportable field) with path-based default
     "name" attribute and make addItem action find targettedItem closest one to
     redirect location to its hash tag.

  💣 Fix (wrong) name attribute in lists' singleton input nodes.

  💣 Fix (wrong) type="input" attribute in lists' singleton input nodes.

  💡 Implement Focus subsystem. Let's say:
    - AddItem send focus to added Item.
    - This item (type) in turn, may re-send it to inner parts (i.e.: first
      input for forms, etc...)

  💡 Implement UNDO component.
    - Contains single component (form, list, input...).
    - Acts as a "man in the middle".
    - Listen to the (future) component's "change" events to capture (export)
      and store changes.
    - Make its own changes' events distinguishable from regular ones (to avoid
      re-caching).
    - Provide additional "undo" and "redo" actions.
    - Etc...

  👉 Improve auto-generated Ids.
    - Allow for (optional) wide creation (not only when needed by .moveTo()
      method).
    - Allow for customisable prefix to avoid (maybe rare but not fully
      impossible) external id collision.
    - Prevent id collision (on auto-creation) by detecting previous duplicates
      and appending incremental suffix on demand.

  💡 Implement Table Of Contents component.
    - Scan targetted component recursively.
    - Refresh on every change (add or remove items).
    - Show only components with a "toc-section" property.
    - Allow navigating to every secton through their (full path) id's.
    - Implement a "return to TOC" actions.
    - Stop scanning on compoenents containing a self-targetted TOC.

