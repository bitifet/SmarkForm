
export default async function ({
    page,
    expect,
    id,
    // root,
    // readField,
    // writeField,
}) {

    // Check that the form container exists
    const formContainer = await page.locator(`#myForm-${id}`);
    await expect(formContainer).toBeVisible();

    // Verify that the form is NOT focused by default
    const isFocusedInside = await formContainer.evaluate((container) =>
      container.contains(document.activeElement)
    );
    expect(isFocusedInside).toBe(false);

};
