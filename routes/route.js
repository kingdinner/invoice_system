const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Middleware to set the current route variable
router.use((req, res, next) => {
    res.locals.currentRoute = req.path;
    next();
});

// Define a route to render the EJS template using the controller
router.get('/', clientController.renderClientDetails);
router.get('/invoice', clientController.renderInvoice);
router.get('/menu', clientController.renderMenu);
router.get('/email', clientController.renderemail);

router.post('/submit-form', clientController.saveDetails);
router.post('/mailSubmit-form', clientController.emailSaveDetails);
router.post('/newClientSubmitForm', clientController.newClient);

router.post('/saveMenu', clientController.insertMenus);
router.post('/savePDF', clientController.generatePDF);
router.post('/updateEmailTemplate', clientController.updateEmailTemplate);
router.post('/insertEmailTemplate', clientController.insertEmailTemplate);
router.post('/sendEmail', clientController.sendEmail);


router.get('/control', clientController.rendercontrol);

module.exports = router;