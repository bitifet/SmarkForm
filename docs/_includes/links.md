
{% assign smarkform_cdn_base = "https://cdn.jsdelivr.net/npm/smarkform" %}

{% assign smarkform_cdn_base_current = smarkform_cdn_base
    | append: "@" | append: site.data.package.version
%}

{% assign smarkform_esm_path = "/dist/SmarkForm.esm.js" %}
{% assign smarkform_umd_path = "/dist/SmarkForm.umd.js" %}

{% assign css_layout_path = "/dist/examples/smarkform_layout_sample.css" %}
{% assign css_styles_path = "/dist/examples/smarkform_styles_sample.css" %}


{% assign smarkform_esm_cdn_latest = smarkform_cdn_base
    | append: smarkform_esm_path
%}
{% assign smarkform_umd_cdn_latest = smarkform_cdn_base
    | append: smarkform_umd_path
%}
{% assign css_layout_cdn_latest = smarkform_cdn_base
    | append: css_layout_path
%}
{% assign css_styles_cdn_latest = smarkform_cdn_base
    | append: css_styles_path
%}


{% assign smarkform_esm_cdn_current = smarkform_cdn_base_current
    | append: smarkform_esm_path
%}
{% assign smarkform_umd_cdn_current = smarkform_cdn_base_current
    | append: smarkform_umd_path
%}
{% assign css_layout_cdn_current = smarkform_cdn_base_current
    | append: css_layout_path
%}
{% assign css_styles_cdn_current = smarkform_cdn_base_current
    | append: css_styles_path
%}


