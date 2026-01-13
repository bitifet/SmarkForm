# PROMPTS.md

> This file is a Kind of "TODO" list for future features and improvements. But,
> instead of simple task headlines, each task is described in detail as a
> prompt draft for an AI language model.
> 
> This way it works trice as:
> 1. A detailed TODO list for future improvements.
> 2. A brainstorm blackboard to sort, refine and organize ideas.
> 3. A prompt storage where to grow and polish prompt drafts until they are ready
>    to be used.
>
> The best thing is that interdependences among tasks can be easily spotted
> before implementation and tweaks can be made before a single line of code is
> written.




### Disabled action

> Status: Draft

I want you to implement a new action called "disable" for the input component types and every other component type that does not inherit from input (form and list).

You also have to implement an internal "disabled" state for every component type which, for input based types, will just rely on the real "disabled" attribute of the targetFieldNode of the component.



### Null action

> Status: Draft

I want you to implement a new action called "null" for the form component type.

Unlike most actions that usually enhance buttons, the "null" action will enhance a checkbox and will work the following way:

If the checkbox is checked (default), every field in the form gets disabled.



