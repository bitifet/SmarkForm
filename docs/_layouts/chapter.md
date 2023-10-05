---
layout: default
---

{{ content }}


<hr/>

<table style="width: 100%">
<tr>
<td style="text-align: left">

{{% if page.next.url %}}
<a href="{{ page.next.url }}">⏪ {{ page.next.title }}</a>
{{% endif %}}

</td><td style="text-align: center">

</td><td style="text-align: right">

{{% if page.previous.url %}}
<a href="{{ page.previous.url }}">{{ page.previous.title }} ⏩</a>
{{% endif %}}

</td></tr>
</table>
