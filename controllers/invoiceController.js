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
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>  
    ${htmlContent}
  </body>
  </html>
`;

  await page.setContent(invoice);

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
      right: '1cm',
      bottom: '1cm',
      left: '1cm',
    },
  });

  await browser.close();

  // Return the generated PDF file name
  return `${pdfPath}/${pdfFileName}`;
}

module.exports = { generateInvoicePDF };

