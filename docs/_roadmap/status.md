---
title: Status
layout: chapter
permalink: /roadmap/status
nav_order: 1

---

# Status

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Implementation !(70%)](#implementation-70)
    * [Core functionality.](#core-functionality)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>




## Implementation ![(70%)](https://progress-bar.dev/65/)


### Core functionality.

<img src="https://progress-bar.dev/95/" alt="(95%)">

*SmarkForm* Core functionality is in mature state.

Almost all initially planed features are implemented and working well.

The only exception is the "API interface" which will allow future *select*
component type to fetch its optinons dynamically depending on the value of
other fields (See *Select Component* in [Core component
types](#core-component-types) section).


{: .caution}
🚧 To be continued...



<details>
<summary><img src="https://progress-bar.dev/60/" alt="(65%)"> Core component types and actions.</summary>


<details>
<summary><img src="https://progress-bar.dev/100/" alt="(100%)"> Form Component Type </summary>

Implementation complete.

</details>

<details>
<summary><img src="https://progress-bar.dev/100/" alt="(100%)"> List Component Type </summary>

Implementation complete.

</details>

<details>
<summary><img src="https://progress-bar.dev/100/" alt="(100%)"> Singleton Component Type </summary>

Implementation complete.

</details>

<details>
<summary><img src="https://progress-bar.dev/100/" alt="(100%)"> Input Component Type </summary>

Implementation complete.

</details>

<details>
<summary><img src="https://progress-bar.dev/0/" alt="(0%)"> Select Component Type.</summary>

Select component will be capable of loading its options from a remote API call
by passing its *src* property to so called "API Interface".

The *API Interface* will allow *select* (and other future components) to fetch
their options dynamically from an external API and react to any change in any
other fields whose value were used as argument to the API call.

For detailed explanation see: [Select Component Type](type_select.md).

</details>

<details>
<summary><img src="https://progress-bar.dev/0/" alt="(0%)"> Number Component Type </summary>

Not yet implemented (but comming soon).

It will just wrap input component to export as number instead of string (we
        will use a separate component to respect original ``<input>`` tag behaviour
        which returns text even if its *type* attribute is "number".

        </details>

        <details>
        <summary><img src="https://progress-bar.dev/0/" alt="(0%)"> Date Component Type </summary>

        Not yet implemented (but comming soon).

        </details>

        <details>
        <summary><img src="https://progress-bar.dev/50/" alt="(50%)"> Action (Special) Component Type </summary>

        Fully functional but only for regular clicks.

        Special behaviours for right / middle / (other) cliks, keyboard events, etc...
        may be eventually implemented in the future. But not a priority yet.

</details>


</details>



<details>
<summary><img src="https://progress-bar.dev/35/" alt="(35%)"> <b>Automated tests.</b></summary>

A mature testing structure with mocha and puppetter is set up to easily
implement tests over any SmarkForm feature.

But only a few actual tests are implemented yet. More tests need to be
developed to ensure all functionality keeps working while implementation
advances.

</details>

<details>
<summary><img src="https://progress-bar.dev/45/" alt="(45%)"> <b>Documentation.</b></summary>

Introductory README file is quite mature. But usage and API documentation still
needs a lot of work...

</details>


> 📌 ...And many more amazing ideas in the [TODO list](./TODO.md).

