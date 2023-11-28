import puppeteer from "puppeteer";
import path from "path";
import Fs from "fs";
import Pug from "pug";

const tmpDir = "test/tmp";
if (! Fs.existsSync(tmpDir)){
     Fs.mkdirSync(tmpDir, { recursive: true });
};
const dirname__ = "src/lib/test";




export async function openFile(filePath, {headless="new"} = {}) {
    const browser = await puppeteer.launch({
        headless,
    });
    const page = await browser.newPage();

    const url = "file://"+path.resolve(filePath);
    await page.goto(url);
    return {browser, page};
};



export async function renderPug({title, src, ...options} = {}) {

    try {

        const baseFileName = title.replace(/\s+/g, "_");
        const htmlFilePath = path.join(tmpDir, `${baseFileName}.html`);

        const html = Pug.render(src, {
            filename: `${dirname__}/${baseFileName}.pug`,
            doctype: "html",
            title,
            ...options,
            self: true,
        });

        await Fs.promises.writeFile(htmlFilePath, html);


        return {
            ...await openFile(htmlFilePath, options),
            async onClosed(){
                await Fs.promises.unlink(htmlFilePath);
            },
        };

    } catch (err) {
        console.error(" 💣 Failed to render PUG test template!!!_____________________________");
        console.error(err);
        console.error(" 💣 __________________________________________________________________");
    };

};


