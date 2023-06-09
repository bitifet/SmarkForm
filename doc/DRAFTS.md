

## [⬆️ ](#-table-of-contents) 👉 Core Component Types

| Type | Description                 | Shared Capabilities                  |
|------|-----------------------------|--------------------------------------|
| [Form](type_form.md)           |   | [foldable](capabilities.md#foldable) |
| [Input](type_input.md)         |   |                                      |
| [List](type_list.md)           |   | [foldable](capabilities.md#foldable) |
| [Singleton](type_singleton.md) |   |                                      |
| [Action](type_action.md)       |   |                                      |




# [⬆️ ](#-table-of-contents)# 👉 Component Options

...

------------

For regular components...

type            | 🔒 action | form | list | input |
----------------|-----------|------|------|-------|
action          | [☑️ ](#action-property) | ❌ | ❌ | ❌ |
name            | ✖️      | [✅]() 
for             | [✅]() | 🔗      | 🔗   | 🔗    |
to              | [✅]() | 🔗      | 🔗   | 🔗    |

(Legend to be continued...)


For actions...

type            | 🔒 action | form | list | input |
----------------|-----------|------|------|-------|
foldedClass     | [❓]() | [🔗]() | [🔗]() | ✖️  |
unfoldedClass   | [❓]() | [🔗]() | [🔗]() | ✖️  |
keep_non_empty  | [❓]() |        | [🔗]() | ✖️  |
autoscroll      | [❓]() |        | [🔗]() | ✖️  |
failback        | [❓]() |        | [🔗]() | ✖️  |

------------

✅ Optional option.
☑️  Mandatory option.
❓ Depends on targetted component type.
🔗 Have actions supporting it.
✖️  Unused/Ignored option.
❌ Forbidden (not allowed for that type)
🔒 Forcibly set to when [action property](#action-property) is defined.













## 👉 data-smark (options) object

### type property

#### Common properties for components

##### name


### action property


#### Common properties for actions

##### for

##### to






