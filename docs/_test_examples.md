---
title: Test Examples for Co-located Tests
layout: chapter
permalink: /test/examples
nav_order: 99
---

# Test Examples

This file is for testing the co-located tests functionality.

## Example with tests=false

{% capture simple_example_html %}
<p>
    <label>Name:</label>
    <input type="text" name="name" data-smark />
</p>
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="test_no_tests"
    htmlSource=simple_example_html
    tests=false
%}

## Example with custom tests

{% capture custom_test_example_html %}
<p>
    <label>First Name:</label>
    <input type="text" name="firstName" data-smark />
</p>
<p>
    <label>Last Name:</label>
    <input type="text" name="lastName" data-smark />
</p>
{% endcapture %}

{% capture custom_test_example_tests %}
export default async ({ page, expect, id, helpers }) => {
  const root = helpers.root(page, id);
  await expect(root).toBeVisible();
  
  // Check that both inputs exist
  const firstNameInput = page.locator('input[name="firstName"]');
  const lastNameInput = page.locator('input[name="lastName"]');
  
  await expect(firstNameInput).toBeVisible();
  await expect(lastNameInput).toBeVisible();
  
  // Try filling the form
  await firstNameInput.fill('John');
  await lastNameInput.fill('Doe');
  
  // Verify the values
  await expect(firstNameInput).toHaveValue('John');
  await expect(lastNameInput).toHaveValue('Doe');
};
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="test_with_custom_tests"
    htmlSource=custom_test_example_html
    tests=custom_test_example_tests
%}
