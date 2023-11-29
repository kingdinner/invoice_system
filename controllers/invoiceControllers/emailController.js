const emailTemplateModel = require('../../models/email');

const renderEmail = (req, res) => {
    res.render('email', { emailValues: emailTemplateModel.get.templates() });
};

const updateEmailTemplate = (req, res) => {
    const { index, editTitle, editText } = req.body;
    const updateStatus = emailTemplateModel.update.template(index, editTitle, editText); // Update template using the model

    if (updateStatus === "Email template updated successfully") {
        res.status(200).send(updateStatus);
    } else {
        res.status(400).send(updateStatus);
    }
};

const insertEmailTemplate = (req, res) => {
    const { newTemplate } = req.body;

    if (newTemplate !== undefined) {
        const insertStatus = emailTemplateModel.insert.template(newTemplate); // Insert new template using the model

        if (insertStatus === "New email template inserted") {
            const emailValues = emailTemplateModel.get.templates(); // Fetch email templates after insert
            res.render('email', { emailValues });
        } else {
            res.status(400).send(insertStatus);
        }
    } else {
        res.status(400).send("Invalid request data.");
    }
};

module.exports = {
    renderEmail,
    updateEmailTemplate,
    insertEmailTemplate
};
