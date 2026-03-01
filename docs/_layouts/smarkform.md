---
layout: default
---

<style>
ul li[data-bullet]::before {
    content: attr(data-bullet);
}
</style>
{{ content }}
