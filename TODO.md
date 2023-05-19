
TO-DO List
==========

  👉 Complete documentation.

  👉 Publish NPM package.

  👉 Try SkyPack to create a CDN.

  👉 Update documentation examples using CDN and linking to CodePen versions.

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

  💡 Implement Table Of Contents component.
    - Scan targetted component recursively.
    - Refresh on every change (add or remove items).
    - Show only components with a "toc-section" property.
    - Allow navigating to every secton through their (full path) id's.
    - Implement a "return to TOC" actions.
    - Stop scanning on compoenents containing a self-targetted TOC.

  💡 Implement a "multiform" component type.
    - Multiple subform templates (every direct child) internally stored (like
      in lists...).
    - Only one actually inserted in DOM (interchangeably).
    - import() and export() methods work always over currently selected subform.
    - Each subform must include a <select> (or any other input smart type) tag
      whose name should match some "selector" field in the options object
      passed to mulitform component (data-smart property) and whose value
      should decide wich template is actually used (making imports and exports
      consistent thanks to this field).
    - Consider using an special action instead of that <select> tag so that it
      can freely placed inside or outside multiform component subtemplates (in
      this case, the "selector" field sholuld be maintained "maically" by
      compoenent's internals).


