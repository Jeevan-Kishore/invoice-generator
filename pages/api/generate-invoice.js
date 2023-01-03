const { months } = require("../../utils/constants");

const ejs = require("ejs");
const { join } = require("path");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { body } = req;
    const postData = JSON.parse(body);
    const monthIndex = months.indexOf(postData.month) + 1;
    ejs.renderFile(
      join(process.cwd(), "utils", "invoice-template.ejs"),
      { ...postData, monthIndex },
      (err, data) => {
        if (err) {
          res.send(err);
        }

        res.setHeader("Content-Type", "text/html");
        res.send(data);

        /*const file = { content: data };

        pdf.generatePdf(file, { printBackground: true }).then((pdfBuffer) => {
          res.setHeader("Content-Type", "text/html; charset=UTF-8");
          res.send(pdfBuffer);
        });*/
      }
    );
  } else {
    res.status(400).json({ error: "Unsupported method" });
  }
}
