const puppeteer = require('puppeteer');
const path = require('path');
const { format } = require('date-fns');
const fs = require('fs');

const generateInvoicePDF = async (htmlContent,client) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();


  // Set the HTML content
  const invoice = `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice System</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    </head>
    <style>
    /* Sidebar styles */
      .body {
          background-color: lightgray;
      }
      .custom-pr-3 {
          padding-left: 2.96rem; /* Adjust the padding value as needed */
      }

      .border-top {
          border-left: 0px;
          border-top: 1px solid #000;
          border-right: 0px;
          border-bottom: none;
      }
      .border-none {
          border: 0px !important;
      }

      .custom-pt-7{
          padding-top: 8rem; /* Adjust the padding value as needed */
      }

      .custom-pt-12{
          padding-top: 10rem; /* Adjust the padding value as needed */
      }

      .invoice-button {
          width: 200px; /* Adjust the width to your preference */
      }

      .card-text {
          border: 1px solid #ccc; /* Add a border */
          padding: 10px; /* Add padding to create space around the text */
          margin-bottom: 10px; /* Add margin between the boxes */
      }

      .custom-box {
          border: 1px solid #ccc;
          padding: 15px;
          background-color: #f7f7f7;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      }
      </style>
      <body>  
        ${htmlContent}
      </body>
    </html>
`;

const test = await page.setContent(invoice);
  // Generate a timestamp for the file name
  const timestamp = format(new Date(), 'yyyyMMddHHmmss');

  // Create the PDF file name using the timestamp
  const pdfFileName = `invoice_${timestamp}.pdf`;
  // Specify the full path to save the PDF in the "public" folder with the generated file name
  const pdfPath = path.resolve(__dirname, `../public/history/${client}`);

  if (!fs.existsSync(pdfPath)) {
    fs.mkdirSync(pdfPath, { recursive: true });
  }

  // Generate a PDF from the HTML content and save it with the generated file name
  await page.pdf({
    path: `${pdfPath}/${pdfFileName}`,
    format: 'A4',
    margin: {
      top: '1cm',
      bottom: '1cm',
    },
  });

  await browser.close();

  // Return the generated PDF file name
  return `${pdfFileName}`;
}

module.exports = { generateInvoicePDF };

