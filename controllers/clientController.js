// Define your array of client names
const invoiceController = require('../controllers/invoiceController');
const nodemailer = require('nodemailer');

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

let inMemoryHistory = {
    2023: {
        client: {}
    }
}

let inMemoryEmailTemplate = {
    template: [
        "Thank you so much for working with us....",
        "It was great to work with "
    ]
}

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
    console.log(companyName)
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
    console.log(JSON.stringify(inMemoryData))

    const clients = getClientNames()

    res.render('clientPage', { clients, clientData: inMemoryData, getClientData: getClientData });
}

//
const insertMenus = (req, res) => {
    inMemoryDataMenus = req.body
    res.render('menu', { menu: inMemoryDataMenus });
};

const renderInvoice = (req, res) => {
    console.log(req.params.clientName)
    res.render('invoice', { client: req.params.clientName, menu: inMemoryDataMenus });
}

const renderMenu = (req, res) => {
    res.render('menu', { menu: inMemoryDataMenus });
}

const generatePDF = async (req, res) => {
    const invoiceHTML = req.body.content
    const client = req.body.clientName
  try {
    const filenamePath = await invoiceController.generateInvoicePDF(invoiceHTML, client);
    const currentYear = new Date().getFullYear(); 

    // Check if the current year exists in inMemoryHistory
    if (!inMemoryHistory[currentYear]) {
        inMemoryHistory[currentYear] = {
            client: {}
        };
    }

    // Check if the client exists in inMemoryHistory for the current year
    if (!inMemoryHistory[currentYear].client[client]) {
        inMemoryHistory[currentYear].client[client] = [];
    }

    // Push the filenamePath to the client's invoices array
    inMemoryHistory[currentYear].client[client].push(filenamePath);
    console.log(JSON.stringify(inMemoryHistory));
    // Respond with a download link for the generated PDF
    res.render('invoice', { client, menu: inMemoryDataMenus });
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
    const emailValues = inMemoryEmailTemplate.template
    res.render('control/sendEmail', { client: req.params.clientName, emailValues, getClientData: getClientData });
}

const sendEmail = (req, res) => {
    const selectedTemplate = req.body.selectedTemplate;
    const bodyMessage = req.body.bodyMessage;
    const attachment = req.body.attachment;
    const clientAddress = req.body.clientAddress;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'your_email_service', // e.g., 'Gmail', 'Outlook'
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_password',
        },
    });

    // Define the email content
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: clientAddress,
        subject: 'Your Subject Here',
        text: bodyMessage,
        html: `<p>${bodyMessage}</p>`,
        attachments: [
            {
                filename: attachment.name,
                content: attachment.data,
            },
        ],
    };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email: ' + error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.render('control');
        }
    });
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
    sendEmail
};
