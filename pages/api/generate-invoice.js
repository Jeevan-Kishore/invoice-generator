const ejs = require("ejs");
const pdf = require("../../utils/pdf-util");
const { join } = require("path");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { body } = req;
    const postData = JSON.parse(body);
    ejs.renderFile(
      join(process.cwd(), "utils", "invoice-template.ejs"),
      { ...postData },
      (err, data) => {
        if (err) {
          res.send(err);
        }
        const file = { content: data };

        pdf.generatePdf(file, { printBackground: true }).then((pdfBuffer) => {
          res.setHeader("Content-Type", "application/pdf;charset=utf-8");
          res.send(pdfBuffer);
        });
      }
    );
  } else {
    res.status(400).json({ error: "Unsupported method" });
  }
}
