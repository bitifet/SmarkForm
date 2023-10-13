---
layout: default
---

{{ content }}


<hr/>

<table style="width: 100%">
<tr>
<td style="text-align: left">

{% if page.previous %}
<a href="{{ page.previous.url | relative_url }}">⏪ {{ page.previous.title }}</a>
{% endif %}

</td><td style="text-align: center">
{{ page.nav_order }}

</td><td style="text-align: right">

{% if page.next %}
<a href="{{ page.next.url | relative_url }}">{{ page.next.title }} ⏩</a>
{% endif %}

</td></tr>
</table>

