const path = require('path');
const { format } = require('date-fns');
const fs = require('fs');
const pdf = require('html-pdf');

const UpdatedFileGenerator = async (htmlContent,client, filename) => {

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
      .hidden {
        display: none;
      }
      .hideSelection {
        display:none;
      }
      </style>
      <body>  
        ${htmlContent}
      </body>
    </html>
`;

const options = {
  format: 'Letter',
  orientation: 'portrait',
};
  // Specify the full path to save the PDF in the "public" folder with the generated file name
  const pdfPath = path.resolve(__dirname, `../../public/history/${client}`);

  if (!fs.existsSync(pdfPath)) {
    fs.mkdirSync(pdfPath, { recursive: true });
  }
  
  const filenametext = filename.replace('pdf', 'text')
  fs.writeFile(`${pdfPath}/${filenametext}`, htmlContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File invoice.html has been saved!');
  });

  pdf.create(invoice, options).toFile(`${pdfPath}/${filename}`, (err, res) => {
    if (err) return console.error(err);
    console.log(`PDF generated at: ${res.filename}`);
  });

  // Return the generated PDF file name
  return `${filename}`;
}

const generateInvoicePDF = async (htmlContent,client) => {

  const options = {
    format: 'Letter',
    orientation: 'portrait',
  };
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
      .hidden {
        display: none;
      }
      .hideSelection {
        display:none;
      }
      </style>
      <body>  
        ${htmlContent}
      </body>
    </html>
`;

  // Generate a timestamp for the file name
  const timestamp = format(new Date(), 'yyyyMMddHHmmss');

  // Create the PDF file name using the timestamp
  const pdfFileName = `invoice_${timestamp}.pdf`;
  // Specify the full path to save the PDF in the "public" folder with the generated file name
  const pdfPath = path.resolve(__dirname, `../../public/history/${client}`);

  if (!fs.existsSync(pdfPath)) {
    fs.mkdirSync(pdfPath, { recursive: true });
  }

  fs.writeFile(`${pdfPath}/invoice_${timestamp}.text`, htmlContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File invoice.html has been saved!');
  });

  pdf.create(invoice, options).toFile(`${pdfPath}/${pdfFileName}`, (err, res) => {
    if (err) return console.error(err);
    console.log(`PDF generated at: ${res.filename}`);
  });

  // Return the generated PDF file name
  return `${pdfFileName}`;
}

module.exports = { generateInvoicePDF,UpdatedFileGenerator };

