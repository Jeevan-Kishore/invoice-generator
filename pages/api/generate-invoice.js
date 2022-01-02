const ejs = require("ejs");
const pdf = require('html-pdf-node');
const { join } = require('path')


const pdfOptions = { format: 'A4' };
export default function handler(req, res) {
    if (req.method === 'POST') {
        ejs.renderFile(join(process.cwd(), 'views', 'invoice-template.ejs'), {}, (err, data) => {
            if (err) {
                res.send(err);
            }
            const file = { content: data };
            res.setHeader("Content-Type","application/pdf");
            pdf.generatePdf(file, pdfOptions).then(pdfBuffer => {
                console.log("PDF Buffer:-", pdfBuffer);
                res.send(pdfBuffer)
            });
        });
    } else {
        res.status(400).json({ error: 'Unsupported method' });
    }
}
