const companyModel = require('../../models/companyInformation');

const renderCompanyInformation = (req, res) => {
    const companyInfo = companyModel.get.companyInfo(); // Fetches the company information from the model
    res.render('companyInformation', { companyInformations: companyInfo });
};

const updatecompanyInformation = (req, res) => {
    const newData = req.body;

    if (req.file) {
        newData.imagePath = '/images/companyImage/' + req.file.filename; // Path to the saved image
    }

    const updateStatus = companyModel.update.companyInfo(newData);

    // Fetch updated company information after the update
    const updatedCompanyInfo = companyModel.get.companyInfo();

    if (updateStatus === 'Company information updated successfully') {
        res.render('companyInformation', { companyInformations: updatedCompanyInfo });
    } else {
        res.status(500).send('Failed to update company information');
    }
}

module.exports = {
    renderCompanyInformation,
    updatecompanyInformation,
};
