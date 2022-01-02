const ejs = require("ejs");
const pdf = require("html-pdf");
const { join } = require('path')

export default function handler(req, res) {
    if (req.method === 'POST') {
        ejs.renderFile(join(process.cwd(), 'views', 'invoice-template.ejs'), {}, (err, data) => {
            if (err) {
                res.send(err);
            }
            res.setHeader("Content-Type","application/pdf");
            pdf.create(data).toBuffer(function(err, buffer){
                res.send(buffer);
            });
        });
    } else {
        res.status(400).json({ error: 'Unsupported method' });
    }
}
