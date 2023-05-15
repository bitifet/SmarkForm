
import puppeteer from 'puppeteer';
import assert from 'assert';
import path from 'path';


describe('Initial test tinkering (temporary) over playground', () => {
  let browser, page;

  before(async () => {
    browser = await puppeteer.launch({
        headless: "new",
    });
    page = await browser.newPage();

    const filePath = 'playground/public/index.html';
    const url = 'file://'+path.resolve(filePath);
    await page.goto(url);
  });

  after(async () => {
    await browser.close();
  });

  it('Document loaded', async () => {
    const pageTitle = await page.title();
    assert.strictEqual(pageTitle, 'SmartForm Demo');
  });

  it('Stylesheet applied', async () => {
    const bodyPosition = await page.$eval('body', el => window.getComputedStyle(el).getPropertyValue("position"));
    assert.strictEqual(bodyPosition, 'fixed');
  });

  it('Basic introspection works', async () => {
    const form_obj = await page.evaluate(
        async () =>  form.find("company").getPath()
    );
    assert.strictEqual(form_obj, '/company');
  });

  it('Lists addItem action works', async () => {
    const listLength = await page.evaluate(async () => {
        const list = form.find("employees");
        await list.addItem();
        await list.addItem();
        await list.addItem();
        return list.count();
    });
    assert.strictEqual(listLength, 3);
  });

  it('Lists removeItem action works', async () => {
    const listLength = await page.evaluate(async () => {
        const list = form.find("employees");
        await list.removeItem();
        return list.count();
    });
    assert.strictEqual(listLength, 2);
  });

});

