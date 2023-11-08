const express = require('express');
const router = express.Router();
const clientController = require('../controllers/invoiceControllers/clientController');
const menuController = require('../controllers/invoiceControllers/menuController');
const companyInfoController = require('../controllers/invoiceControllers/companyInformationController');
const emailController = require('../controllers/invoiceControllers/emailController');

// Middleware to set the current route variable
router.use((req, res, next) => {
    res.locals.currentRoute = req.path;
    next();
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/companyImage'); // Define the folder to store the uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, 'company_image.jpg'); // Define the filename or any naming convention you want to apply
    }
});

const storageClient = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/clientImage'); // Define the folder to store the uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Preserve the original filename
    }
});

const upload = multer({ storage: storage });
const uploadClient = multer({ storage: storageClient });

// Define a route to render the EJS template using the controller
router.get('/', clientController.renderClientDetails);
router.get('/invoice/client', clientController.renderClientDetails);
router.get('/invoice/menu', menuController.renderMenu);
router.get('/invoice/email', emailController.renderEmail);


router.post('/invoice/updateEmailTemplate', emailController.updateEmailTemplate);
router.post('/invoice/insertEmailTemplate', emailController.insertEmailTemplate);

router.post('/invoice/submit-form', uploadClient.single('image'), clientController.saveDetails);
router.post('/invoice/mailSubmit-form', clientController.emailSaveDetails);
router.post('/invoice/newClientSubmitForm', clientController.newClient);

router.post('/invoice/saveMenu', menuController.insertMenus);
router.post('/invoice/savePDF', clientController.generatePDF);
router.post('/invoice/sendEmail', clientController.sendEmail);

router.get('/invoice/control/sendEmail/:clientName', clientController.rendercontrolEmail);
router.get('/invoice/control/createInvoice/:clientName', clientController.renderInvoice);

router.get('/invoice/control/history/:clientName', clientController.rendercontrolHistory);

router.get('/invoice/company-information', companyInfoController.renderCompanyInformation);
router.post('/invoice/update/companyInformation', upload.single('image'), companyInfoController.updatecompanyInformation);

module.exports = router;