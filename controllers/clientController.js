// Define your array of client names
const invoiceController = require('../controllers/invoiceController');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');

let inMemoryData = [{
    clients: [
        {
            client: "Joe",
            companyName: "ABC Company",
            personInCharge: "Joe Doe",
            address: "ABC Street",
            emailAddress: "abc@example.com",
            notes: "ABC",
            emailTemplate: "asdasd"
        },
        {
            client: "Joe Doe"
        }, 
        {    
            client: "Joe Twin"
        }
    ]
}];

let inMemoryHistory = {"2023":{"January":{"client":{Joe:[]}},"October":{"client":{Joe:["invoice_20231018110214.pdf","invoice_20231018110432.pdf"]}}}}

let inMemoryEmailTemplate = {
    template: [
        "Thank you so much for working with us....",
        "It was great to work with "
    ]
}

let inMemoryCompanyInformation = {
    companyName: "J-wire株式会社",
    address: "1234 Tech Park Avenue, Example Example",
    emailAddress: "J-wire株式会社@example.com",
    bankingDetails: [
        {
            companyName: "J-wire株式会社",
            bankName: "住信SBIネット銀行",
            branchNo: "106",
            branchName: "法人第一支店",
            type: "普通",
            accountNo: "1193845"
        },
        {
            companyName: "Western Union",
            bankName: "住信SBIネット銀行",
            branchNo: "106",
            branchName: "法人第一支店",
            type: "普通",
            accountNo: "1193845"
        }
    ],
    taxRegistrationNumbers: "T9080401021109"
};


let inMemoryDataMenus = [
    {
        name: 'asdasd',
        details: 'Sample details 1',
        price: 10.99,
        tax: 4
    },
    {
        name: 'example',
        details: 'Sample details 2',
        price: 15.99,
        tax: 5
    },
];

// Controller function to render the EJS template

const getClientData = (clientName, fieldName) => {
    const clientDataArray = inMemoryData[0].clients;
    for (const key in clientDataArray) {
        if (clientDataArray[key].client === clientName) {
            return clientDataArray[key][fieldName];
        }
    }
    return null;
};

const getClientNames = () => {
    return inMemoryData.flatMap(item => {
        return Object.values(item.clients).map(client => client.client);
    });
}

const renderClientDetails = (req, res) => {
    const clients = getClientNames()
    res.render('clientPage', { clients, clientData: inMemoryData, getClientData: getClientData });
}

const newClient = (req,res) => {
    const {clientname, companyName, personInCharge, address, emailAddress, notes} = req.body
    const clientDataArray = inMemoryData[0].clients;
    const newClient = {
        client: clientname,
        companyName,
        personInCharge,
        address,
        emailAddress,
        notes
    }
    clientDataArray.push(newClient)
    inMemoryData[0].clients = clientDataArray
    const clients = getClientNames()

    res.render('clientPage', { clients, clientData: inMemoryData, getClientData: getClientData });
}

const saveDetails = (req, res) => {

    const clientName = req.body.clientDetailsContent;
    const clientDataArray = inMemoryData[0].clients;
    for (const key in clientDataArray) {
        if (clientDataArray[key].client == clientName) {
            clientKey = key;
        }
    }
    const updateDatas = clientDataArray[clientKey]
    updateDatas.client = req.body.clientname
    updateDatas.companyName = req.body.companyName
    updateDatas.personInCharge = req.body.personInCharge
    updateDatas.address = req.body.address
    updateDatas.emailAddress = req.body.emailAddress
    updateDatas.notes = req.body.notes

    inMemoryData[0].clients[clientKey] = updateDatas

    const clients = getClientNames()

    res.render('clientPage', { clients, clientData: inMemoryData, getClientData: getClientData });
}

const emailSaveDetails = (req, res) => {
    const clientName = req.body.clientDetailsContent;
    const clientDataArray = inMemoryData[0].clients;
    for (const key in clientDataArray) {
        if (clientDataArray[key].client == clientName) {
            clientKey = key;
        }
    }
    const updateDatas = clientDataArray[clientKey]
    updateDatas.emailTemplate = req.body.bodyTemplate

    inMemoryData[0].clients[clientKey] = updateDatas

    const clients = getClientNames()

    res.render('clientPage', { clients, clientData: inMemoryData, getClientData: getClientData });
}

//
const insertMenus = (req, res) => {
    inMemoryDataMenus = req.body
    res.render('menu', { menu: inMemoryDataMenus });
};

const renderInvoice = (req, res) => {
    const bankList = [];

    // Iterate through the bankingDetails and collect unique bank names
    for (const detail of inMemoryCompanyInformation.bankingDetails) {
      if (detail.companyName && !bankList.includes(detail.companyName)) {
        bankList.push(detail.companyName);
      }
    }

    res.render('control/invoice', { 
        client: req.params.clientName, 
        menu: inMemoryDataMenus, 
        company: inMemoryCompanyInformation,
        bankList
    });
}

const renderMenu = (req, res) => {
    res.render('menu', { menu: inMemoryDataMenus });
}

const generatePDF = async (req, res) => {
    const invoiceHTML = req.body.content
    const client = req.body.clientName.trim().replace(/ /g, '_');
  try {
    const filenamePath = await invoiceController.generateInvoicePDF(invoiceHTML, client);
    const currentYear = new Date().getFullYear(); 
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    if (!inMemoryHistory[currentYear]) {
        inMemoryHistory[currentYear] = {};
    }
    
    if (!inMemoryHistory[currentYear][currentMonth]) {
        inMemoryHistory[currentYear][currentMonth] = {
            client: {
                [client]: [],
            },
        };
    }

    if (!inMemoryHistory[currentYear][currentMonth].client[client]) {
        inMemoryHistory[currentYear][currentMonth].client = {
            [client]: []
        };
    }
    
    // Push the filenamePath to the client's invoices array
    inMemoryHistory[currentYear][currentMonth].client[client].push(filenamePath);
    // Respond with a download link for the generated PDF
    console.log("completed")
    res.render('control/invoice', { client, menu: inMemoryDataMenus });
  } catch (error) {
    res.status(500).send('Error generating the invoice.');
  }
}

const renderemail = async (req, res) => {
    res.render('email', {emailValues: inMemoryEmailTemplate});
}

const updateEmailTemplate = async(req,res) => {
    const { index, editedText } = req.body;

    if (index !== undefined && editedText !== undefined) {
        // Update the email template in memory
        if (inMemoryEmailTemplate.template[index] !== undefined) {
            inMemoryEmailTemplate.template[index] = editedText;
            res.status(200).send("Email template updated successfully.");
        } else {
            res.status(400).send("Invalid index.");
        }
    } else {
        res.status(400).send("Invalid request data.");
    }
}

const insertEmailTemplate = async(req, res) => {
    const { newTemplate } = req.body;

    if (newTemplate !== undefined) {
        // Add the new email template to the in-memory list
        inMemoryEmailTemplate.template.push(newTemplate);
        res.render('email', {emailValues: inMemoryEmailTemplate});
    } else {
        res.status(400).send("Invalid request data.");
    }
}

const rendercontrolEmail = (req, res) => {
    const emailValues = inMemoryEmailTemplate.template;
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const clientName = req.params.clientName;
    const currentYear = new Date().getFullYear(); // Get the current year dynamically

    // Retrieve client data for the current month, client, and year
    let invoiceData
    if (inMemoryHistory[currentYear][currentMonth]) {
        invoiceData = inMemoryHistory[currentYear][currentMonth].client[clientName];
    } else {
        if (!inMemoryHistory[currentYear]) {
            inMemoryHistory[currentYear] = {}; // Initialize the year object if it doesn't exist
        }
        
        if (!inMemoryHistory[currentYear][currentMonth]) {
            inMemoryHistory[currentYear][currentMonth] = {'client':{}}; // Initialize the month object if it doesn't exist
        }
    }
    res.render('control/sendEmail', { client: clientName, emailValues, invoiceData, getClientData });
}


const sendEmail = (req, res) => {
    const companyEmail = inMemoryCompanyInformation.emailAddress
    const bodyMessage = req.body.selectedTemplate;
    const attachment = req.body.attachment;
    const clientAddress = req.body.clientAddress;
    const title = req.body.title;
    const attachmentPath = path.resolve(__dirname, `../public/history/Joe/${attachment}`);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io', // Mailtrap SMTP host
        port: 2525, // Mailtrap SMTP port
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

            const emailValues = inMemoryEmailTemplate.template;
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const clientName = req.params.clientName;
            const currentYear = new Date().getFullYear(); // Get the current year dynamically
        
            // Retrieve client data for the current month, client, and year
        
            inMemoryHistory[currentYear][currentMonth].client[clientName].push(attachment);
            res.render('control/sendEmail', { client: clientName, emailValues, invoiceData, getClientData });
        }
    });
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
        if (!inMemoryHistory[year][month]) {
            newInMemoryHistory[year][month] = { "client": {} };
        } else {
            newInMemoryHistory[year][month] = inMemoryHistory[year][month];
        }
    });
    
    const clientData = newInMemoryHistory;
    res.render('control/history', { client: clientName, clientData, getClientData, changeBasedYear });
}

const changeBasedYear = (selectedYear) => {
    clientData[selectedYear] = inMemoryHistory[selectedYear] || {};
};

const renderCompanyInformation = (req, res) => {
    res.render('companyInformation', {inMemoryCompanyInformation});
}

const updatecompanyInformation = (req,res) => {
    inMemoryCompanyInformation = req.body
    res.render('companyInformation', {inMemoryCompanyInformation});
}

module.exports = {
    renderClientDetails,
    renderInvoice,
    saveDetails,
    emailSaveDetails,
    insertMenus,
    renderMenu,
    generatePDF,
    newClient,
    renderemail,
    updateEmailTemplate,
    insertEmailTemplate,
    rendercontrolEmail,
    sendEmail,
    rendercontrolHistory,
    renderCompanyInformation,
    updatecompanyInformation,
};
