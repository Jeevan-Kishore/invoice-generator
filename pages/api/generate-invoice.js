const path = require("path");
const ejs = require("ejs");
const pdf = require("html-pdf");

export default function handler(req, res) {
    if (req.method === 'POST') {
        ejs.renderFile(path.join(__dirname, './views/', "invoice-template.ejs"), {}, (err, data) => {
            console.log(" DEBUG: ", "--------------------------->", data);
            res.send(data);
        });
    } else {
        // Handle any other HTTP method
    }
}
