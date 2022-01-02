const ejs = require("ejs");
const pdf = require("html-pdf");
const { join } = require('path')

export default function handler(req, res) {
    if (req.method === 'POST') {
        ejs.renderFile(join(process.cwd(), 'views', 'invoice-template.ejs'), {}, (err, data) => {
            if (err) {
                console.log(" DEBUG: ", "--------------------------->",join(__dirname, 'views', 'invoice-template.ejs'));
                res.send(err);
            }
            console.log(" DEBUG: ", "--------------------------->", data, join(__dirname, 'views', 'invoice-template.ejs'));
            res.send(data);
        });
    } else {
        // Handle any other HTTP method
    }
}
