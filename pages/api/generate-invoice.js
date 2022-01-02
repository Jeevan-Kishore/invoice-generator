const ejs = require("ejs");
const pdf = require("../../utils/pdf-util");
const { join } = require('path')


const pdfOptions = { format: 'A4' };
export default function handler(req, res) {
    if (req.method === 'POST') {
        ejs.renderFile(join(process.cwd(), 'utils', 'invoice-template.ejs'), {}, (err, data) => {
            if (err) {
                res.send(err);
            }
            const file = { content: data };

            pdf.generatePdf(file, pdfOptions).then(pdfBuffer => {
                console.log("PDF Buffer:-", pdfBuffer);
                res.setHeader("Content-Type","application/pdf");
                res.send(pdfBuffer)
            });
        });
    } else {
        res.status(400).json({ error: 'Unsupported method' });
    }
}
