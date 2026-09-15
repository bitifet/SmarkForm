import path from "path";
import Fs from "fs";
import Pug from "pug";
import http from "http";
import { fileURLToPath } from 'url';

const tmpDir = "test/tmp";
if (! Fs.existsSync(tmpDir)){
     Fs.mkdirSync(tmpDir, { recursive: true });
};
const dirname__ = "src/lib/test";

// Singleton HTTP server
let server = null;
let serverPort = null;

// Content-type mapping
const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return contentTypes[ext] || 'application/octet-stream';
}

async function ensureServer() {
    if (server && serverPort) {
        return serverPort;
    }

    return new Promise((resolve, reject) => {
        server = http.createServer((req, res) => {
            // Remove query string and decode URI
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            const filePath = path.join(process.cwd(), urlPath);

            Fs.readFile(filePath, (err, data) => {
                if (err) {
                    // Repository root has no "assets/" — docs assets live under
                    // docs/assets/ (which the built site serves at /assets/).
                    // Accept that same canonical URL in tests too.
                    if (urlPath.startsWith('/assets/')) {
                        const docsPath = path.join(process.cwd(), 'docs', urlPath.slice(1));
                        Fs.readFile(docsPath, (err2, data2) => {
                            if (err2) {
                                res.writeHead(404, { 'Content-Type': 'text/plain' });
                                res.end('Not Found');
                                return;
                            }
                            res.writeHead(200, { 'Content-Type': getContentType(docsPath) });
                            res.end(data2);
                        });
                        return;
                    }
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                    return;
                }

                res.writeHead(200, { 'Content-Type': getContentType(filePath) });
                res.end(data);
            });
        });

        server.listen(0, '127.0.0.1', () => {
            serverPort = server.address().port;
            resolve(serverPort);
        });

        server.on('error', reject);
    });
}

export async function getServerPort() {
    return await ensureServer();
}

export async function renderPug({title, src, ...options} = {}) {

    try {
        const baseFileName = title.replace(/\s+/g, "_");
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const htmlFileName = `${baseFileName}_${randomSuffix}.html`;
        const htmlFilePath = path.join(tmpDir, htmlFileName);

        const html = Pug.render(src, {
            filename: `${dirname__}/${baseFileName}.pug`,
            doctype: "html",
            title,
            ...options,
            self: true,
        });

        await Fs.promises.writeFile(htmlFilePath, html);

        const port = await ensureServer();
        const url = `http://127.0.0.1:${port}/test/tmp/${htmlFileName}`;

        return {
            url,
            async onClosed(){
                await Fs.promises.unlink(htmlFilePath).catch(() => {});
            },
        };

    } catch (err) {
        console.error(" 💣 Failed to render PUG test template!!!_____________________________");
        console.error(err);
        console.error(" 💣 __________________________________________________________________");
        throw err;
    };

};


