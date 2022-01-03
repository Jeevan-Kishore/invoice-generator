const ejs = require("ejs");
const pdf = require("../../utils/pdf-util");
const { join } = require('path')


export default function handler(req, res) {
    if (req.method === 'POST') {
        const { body } = req;
        console.log(" DEBUG: ", "--------------------------->", body.name);
        ejs.renderFile(join(process.cwd(), 'utils', 'invoice-template.ejs'), {}, (err, data) => {
            if (err) {
                res.send(err);
            }
            const file = { content: data };

            pdf.generatePdf(file).then(pdfBuffer => {
                res.setHeader("Content-Type","application/pdf");
                res.send(pdfBuffer);
            });
        });
    } else {
        res.status(400).json({ error: 'Unsupported method' });
    }
}
