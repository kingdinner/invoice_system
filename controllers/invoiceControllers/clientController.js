// Define your array of client names
const invoiceController = require('../invoiceControllers/invoiceController');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const clientModel = require('../../models/clients');
const companyModel = require('../../models/companyInformation');
const emailTemplateModel = require('../../models/email');
const menuModel = require('../../models/menu');
const historyModel = require('../../models/history');
const {readMemoFile, updateMemoFile}=require('./utils/utils');

const getClientData = (clientName, fieldName) => {
    const client = clientModel.find.clientByName(clientName);
    if (client) {
        return client[fieldName];
    }
    return null;
};

const getClientNames = () => {
    const clients = clientModel.get.clientNames();
    return clients;
}

const renderClientDetails = async (req, res) => {
    const clients = getClientNames()
    const memoFilePath = path.join(__dirname, '../../public/utils/memo.txt');
    const displayMemoList = await readMemoFile(memoFilePath)
    res.render('clientPage', { clients, getClientData: getClientData, displayMemoList });
}

const newClient = async (req,res) => {
    const {clientname, companyName, personInCharge, address, emailAddress, notes} = req.body
    const newClientData = {
        client: clientname,
        companyName: companyName,
        personInCharge: personInCharge,
        address: address,
        emailAddress: emailAddress,
        notes: notes
    };
    
    // Call the insert method with the new client data
    clientModel.insert.client(newClientData);
    const clients = getClientNames()
    const memoFilePath = path.join(__dirname, '../../public/utils/memo.txt');
    const displayMemoList = await readMemoFile(memoFilePath)
    res.render('clientPage', { clients, getClientData: getClientData, displayMemoList });
}

const updateMemoClient = async(req, res) => {
    console.log(req.body)
    const {memo, clientName} = req.body
    const clientToUpdate = clientModel.find.clientByName(clientName);
    if (clientToUpdate) {
        clientToUpdate.memo = memo;
        // Update the client data in the model
        clientModel.update.client(clientName, clientToUpdate);

        // Retrieve updated client names from the model
        const clients = clientModel.get.clientNames();

        // Render the 'clientPage' view with updated data
        const memoFilePath = path.join(__dirname, '../../public/utils/memo.txt');
        const displayMemoList = await readMemoFile(memoFilePath)
        res.render('clientPage', { clients, getClientData: getClientData, displayMemoList });
    } else {
        // Handle the case where the client to update is not found
        res.send('Client not found');
    }
}

const saveDetails = async(req, res) => {
    const clientName = req.body.clientDetailsContent;
    const clientToUpdate = clientModel.find.clientByName(clientName);
    
    if (clientToUpdate) {
        // If the image was uploaded successfully, update the client data
        clientToUpdate.client = req.body.clientname;
        clientToUpdate.companyName = req.body.companyName;
        clientToUpdate.personInCharge = req.body.personInCharge;
        clientToUpdate.address = req.body.address;
        clientToUpdate.emailAddress = req.body.emailAddress;
        clientToUpdate.notes = req.body.notes;

        // Check if an image was uploaded
        if (req.file) {
            clientToUpdate.imagePath = `/images/client/${req.file.filename}`;
        }
 
        // Update the client data in the model
        clientModel.update.client(clientName, clientToUpdate);

        // Retrieve updated client names from the model
        const clients = clientModel.get.clientNames();

        // Render the 'clientPage' view with updated data
        const memoFilePath = path.join(__dirname, '../../public/utils/memo.txt');
        const displayMemoList = await readMemoFile(memoFilePath)
        res.render('clientPage', { clients, getClientData: getClientData, displayMemoList });
    } else {
        // Handle the case where the client to update is not found
        res.send('Client not found');
    }
};


const emailSaveDetails = (req, res) => {
    const clientName = req.body.clientDetailsContent;

    const clientToUpdate = clientModel.find.clientByName(clientName);

    if (clientToUpdate) {
        // Update the email template for the client based on the request body
        clientToUpdate.emailTemplate = req.body.bodyTemplate;

        // Update the client data in the model
        clientModel.update.client(clientName, clientToUpdate);

        // Retrieve updated client names from the model
        const clients = clientModel.get.clientNames();

        // Render the 'clientPage' view with updated data
        res.render('clientPage', { clients, clientData: clientModel.get.clients(), getClientData: clientModel.find.clientByName });
    } else {
        // Handle the case where the client to update is not found
        res.send('Client not found');
    }
};

const renderInvoice = (req, res) => {
    const bankList = [];
    const companyInfo = companyModel.get.companyInfo(); // Fetch company information using the model
    const menu = menuModel.get.menus();

    // Iterate through the bankingDetails and collect unique bank names
    for (const detail of companyInfo.bankingDetails) {
        if (detail.companyName && !bankList.includes(detail.companyName)) {
            bankList.push(detail.companyName);
        }
    }

    res.render('control/invoice', { 
        client: req.params.clientName, 
        menu, // Assuming inMemoryDataMenus is available
        company: companyInfo, // Use fetched company information
        bankList
    });
};
const updatePDF = async(req, res) => {
    const bankList = [];
    const filename = req.params.fileName
    const client = req.body.clientName.trim().replace(/ /g, '_');
    const invoiceHTML = req.body.content
    const companyInfo = companyModel.get.companyInfo();
//   try {
    await invoiceController.UpdatedFileGenerator(invoiceHTML, client, filename);

    for (const detail of companyInfo.bankingDetails) {
        if (detail.companyName && !bankList.includes(detail.companyName)) {
            bankList.push(detail.companyName);
        }
    }

    // Respond with a download link for the generated PDF
    res.render('control/invoice', { client, menu: menuModel.get.menus(), company: companyInfo, bankList });
}

const generatePDF = async (req, res) => {
    const bankList = [];
    const invoiceHTML = req.body.content
    const client = req.body.clientName.trim().replace(/ /g, '_');
    const companyInfo = companyModel.get.companyInfo();

//   try {
    const filenamePath = await invoiceController.generateInvoicePDF(invoiceHTML, client);
    const currentYear = new Date().getFullYear(); 
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    if (!historyModel.find.historyByYear) {
        historyModel.update.historyByYear(currentYear)
    }
    if (!historyModel.find.historyByMonth(currentYear,currentMonth)) {
        historyModel.update.historyByMonth(currentYear,currentMonth, {
            client: {
                [client]: [],
            },
        })
    }


    for (const detail of companyInfo.bankingDetails) {
        if (detail.companyName && !bankList.includes(detail.companyName)) {
            bankList.push(detail.companyName);
        }
    }
    
    // Push the filenamePath to the client's invoices array
    historyModel.update.historyByFilePath(currentYear,currentMonth, client, filenamePath)
    // Respond with a download link for the generated PDF
    res.render('control/invoice', { 
        client, 
        menu: menuModel.get.menus(),
        company: companyInfo, // Use fetched company information
        bankList
    });
//   } catch (error) {
//     res.status(500).send('Error generating the invoice.');
//   }
}


const rendercontrolEmail = (req, res) => {
    const emailValues = emailTemplateModel.get.templates();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const clientName = req.params.clientName;
    const currentYear = new Date().getFullYear(); // Get the current year dynamically

    // Retrieve client data for the current month, client, and year
    let invoiceData
    if (historyModel.find.historyByMonth(currentYear, currentMonth)) {
       invoiceData = historyModel.find.historyByClient(currentYear,currentMonth, clientName)
    }
    console.log(invoiceData)
    res.render('control/sendEmail', { client: clientName, emailValues, invoiceData, getClientData });
}


const sendEmail = (req, res) => {
    const companyInfo = companyModel.get.companyInfo(); // Fetch company information using the model
    const companyEmail = companyInfo.emailAddress;
    const bodyMessage = req.body.selectedTemplate;
    const attachment = req.body.attachment;
    const clientAddress = req.body.clientAddress;
    const title = req.body.title;
    const attachmentPath = path.resolve(__dirname, `../../public/history/Joe/${attachment}`);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_USER, // Mailtrap username (replace with your credentials)
            pass: process.env.MAILTRAP_PASS, // Mailtrap password (replace with your credentials)
        },
    });
    // Define the email content
    const mailOptions = {
        from: companyEmail,
        to: clientAddress,
        subject: title,
        text: bodyMessage,
        html: `<p>${bodyMessage}</p>`,
        attachments: [
            {
                filename: attachment,
                path: attachmentPath, // Specify the correct file path
            },
        ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email: ' + error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);

            // Check if the attachment was sent successfully
            if (info.accepted.includes(clientAddress)) {
                console.log('Attachment sent successfully.');
            } else {
                console.error('Attachment not sent.');
            }

            const emailValues = emailTemplateModel.get.templates(); ;
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const clientName = req.params.clientName;
            const currentYear = new Date().getFullYear(); // Get the current year dynamically
        
            // Retrieve client data for the current month, client, and year
            // inMemoryHistory[currentYear][currentMonth].client[clientName].push(attachment);
            res.render('control/sendEmail', { client: clientName, emailValues, invoiceData, getClientData });
        }
    });
}

const invoiceEditPDF = (req,res) => {
    const extract = req.params.fileName.split('-')
    const filename = extract[1].replace('pdf', 'text')
    const newPath = path.resolve(__dirname, `../../public/history/${extract[0]}/${filename}`);
    
    const bankList = [];
    const companyInfo = companyModel.get.companyInfo();

    // Iterate through the bankingDetails and collect unique bank names
    for (const detail of companyInfo.bankingDetails) {
        if (detail.companyName && !bankList.includes(detail.companyName)) {
            bankList.push(detail.companyName);
        }
    }
    
    fs.readFile(newPath, 'utf8', (err, invoiceContent) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading the invoice file');
          return;
        }

        res.render('control/editInvoice', { company: companyInfo, invoiceContent });
    });
}


const deletePDFActions = (req, res) => {
    const {client, attachment} = req.body
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const year = new Date().getFullYear();
    
    const newInMemoryHistory = {}; // Creating a new object to store corrected month structure
    newInMemoryHistory[year] = {};
    
    months.forEach(month => {
        if (!historyModel.find.historyByMonth(year, month)) {
            newInMemoryHistory[year][month] = { "client": {} };
        } else {
            newInMemoryHistory[year][month] = historyModel.delete(year, month, client, attachment);
        }
    });
    const filePath = path.resolve(__dirname, `../../public/history/${client}/${attachment}`); // Replace this with the actual file path
    const filePathText = path.resolve(__dirname, `../../public/history/${client}/${attachment.replace('pdf', 'text')}`); // Replace this with the actual file path
    // Delete the file
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log('File deleted successfully');
    });
    fs.unlink(filePathText, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log('File deleted successfully');
    });
    const clientData = newInMemoryHistory;
    res.render('control/history', { client, clientData, getClientData, changeBasedYear });
}

const rendercontrolHistory = (req, res) => {
    const clientName = req.params.clientName.replace(/\s/g, '_').trim();
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const year = new Date().getFullYear();
    
    const newInMemoryHistory = {}; // Creating a new object to store corrected month structure
    newInMemoryHistory[year] = {};
    
    months.forEach(month => {
        if (!historyModel.find.historyByMonth(year, month)) {
            newInMemoryHistory[year][month] = { "client": {} };
        } else {
            newInMemoryHistory[year][month] = historyModel.find.historyByMonth(year, month);
        }
    });
    
    const clientData = newInMemoryHistory;
    res.render('control/history', { client: clientName, clientData, getClientData, changeBasedYear });
}

const changeBasedYear = (selectedYear) => {
    clientData[selectedYear] = inMemoryHistory[selectedYear] || {};
};

const memo = async (req,res) => {
    const memoFilePath = path.join(__dirname, '../../public/utils/memo.txt');
    await updateMemoFile(memoFilePath, req.body.newOption);
    const displayMemoList = await readMemoFile(memoFilePath)
    const clients = getClientNames()
    res.render('clientPage', { clients, getClientData: getClientData, displayMemoList });
}

const updateMemo = async (req, res) => {
    const clientName = req.body.clientDetailsContent;
    const clientToUpdate = clientModel.find.clientByName(clientName);
    
    if (clientToUpdate) {
        // If the image was uploaded successfully, update the client data
        clientToUpdate.client = req.body.clientname;
        clientToUpdate.companyName = req.body.companyName;
        clientToUpdate.personInCharge = req.body.personInCharge;
        clientToUpdate.address = req.body.address;
        clientToUpdate.emailAddress = req.body.emailAddress;
        clientToUpdate.notes = req.body.notes;
    }
        // Check if an image was uploaded
    if (req.file) {
        clientToUpdate.imagePath = `/images/client/${req.file.filename}`;
    }

    // Update the client data in the model
    clientModel.update.client(clientName, clientToUpdate);

    // Retrieve updated client names from the model
    const clients = clientModel.get.clientNames();


    res.render('clientPage', { clients, getClientData: getClientData, displayMemoList });
}

const changeFileName = (req, res) => {
    const {newName, year, month, attachment, clientName} = req.body
    historyModel.update.historyUpdateFileName(year, month, clientName, attachment, newName)
    const filePath = path.join('public', 'history', clientName, attachment);
    const newFilePath = path.join('public', 'history', clientName, newName + '.pdf');
    const filePathtext = path.join('public', 'history', clientName, attachment.replace('.pdf', '.text'))
    const newFiletext = path.join('public', 'history', clientName, newName + '.text');
    if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, newFilePath);
    }
    if (fs.existsSync(filePathtext)) {
        fs.renameSync(filePathtext, newFiletext);
    }
}

module.exports = {
    renderClientDetails,
    renderInvoice,
    saveDetails,
    emailSaveDetails,
    generatePDF,
    newClient,
    rendercontrolEmail,
    sendEmail,
    rendercontrolHistory,
    invoiceEditPDF,
    updatePDF,
    deletePDFActions,
    memo,
    updateMemo,
    updateMemoClient,
    changeFileName
};
