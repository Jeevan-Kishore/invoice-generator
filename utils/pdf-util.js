const Promise = require('bluebird');
const hb = require('handlebars');
const inlineCss = require('inline-css');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
module.exports
async function generatePdf(file, options, callback) {

    let browser = await puppeteer.launch({
        args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    let data;
    if (file.content) {
        data = await inlineCss(file.content, {url: "/"});
        console.log("Compiling the template with handlebars")
        // we have compile our code with handlebars
        const template = hb.compile(data, {strict: true});
        const result = template(data);
        const html = result;

        // We set the page content as the generated html by handlebars
        await page.setContent(html, {
            waitUntil: 'networkidle0', // wait for page to load completely
        });
    } else {
        await page.goto(file.url, {
            waitUntil: ['load', 'networkidle0'], // wait for page to load completely
        });
    }

    console.log(" DEBUG: ", "---------------------------> HERE");

    return Promise.props(page.pdf(options))
        .then(async function(data) {
            await browser.close();
            console.log(" DEBUG: ", "---------------------------> THERE");
            return Buffer.from(Object.values(data));
        }).asCallback(callback);
}

async function generatePdfs(files, options, callback) {
    // we are using headless mode
    let args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
    ];
    if(options.args) {
        args = options.args;
        delete options.args;
    }
    const browser = await puppeteer.launch({
        args: args
    });
    let pdfs = [];
    const page = await browser.newPage();
    for(let file of files) {
        if(file.content) {
            data = await inlineCss(file.content, {url:"/"})
            console.log("Compiling the template with handlebars")
            // we have compile our code with handlebars
            const template = hb.compile(data, { strict: true });
            const result = template(data);
            const html = result;
            // We set the page content as the generated html by handlebars
            await page.setContent(html, {
                waitUntil: 'networkidle0', // wait for page to load completely
            });
        } else {
            await page.goto(file.url, {
                waitUntil: 'networkidle0', // wait for page to load completely
            });
        }
        let pdfObj = JSON.parse(JSON.stringify(file));
        delete pdfObj['content'];
        pdfObj['buffer'] = Buffer.from(Object.values(await page.pdf(options)));
        pdfs.push(pdfObj);
    }

    return Promise.resolve(pdfs)
        .then(async function(data) {
            await browser.close();
            return data;
        }).asCallback(callback);
}

module.exports.generatePdf = generatePdf;
module.exports.generatePdfs = generatePdfs;
