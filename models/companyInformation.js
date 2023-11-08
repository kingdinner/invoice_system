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

const companyModel = {
    get: {
        companyInfo: () => inMemoryCompanyInformation,
        bankingDetails: () => inMemoryCompanyInformation.bankingDetails,
    },
    update: {
        companyInfo: (newData) => {
            console.log(newData)
            inMemoryCompanyInformation = newData
            return "Company information updated successfully";
        },
    },
};

module.exports = companyModel;
