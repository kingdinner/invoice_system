const companyModel = require('../../models/companyInformation');

const renderCompanyInformation = (req, res) => {
    const companyInfo = companyModel.get.companyInfo(); // Fetches the company information from the model
    res.render('companyInformation', { companyInformations: companyInfo });
};

const updatecompanyInformation = (req, res) => {
    const newData = req.body;
    const updateStatus = companyModel.update.companyInfo(newData); // Update company information using the model

    // Fetch updated company information after the update
    const updatedCompanyInfo = companyModel.get.companyInfo();
    if (updateStatus === "Company information updated successfully") {
        res.render('companyInformation', { companyInformations: updatedCompanyInfo });
    } else {
        res.status(500).send('Failed to update company information');
    }
};

module.exports = {
    renderCompanyInformation,
    updatecompanyInformation,
};
