let inMemoryHistory = {
    "2023": {
        "January": {
            "client": {
                "Joe": []
            }
        },
        "November": {
            "client": {
                "Joe": ["invoice_20231119195540.pdf", "invoice_20231120202531.pdf"]
            }
        }
    }
};

const historyModel = {
    find: {
        historyByMonth: (year, month) => {
            if (inMemoryHistory[year] && inMemoryHistory[year][month]) {
                return inMemoryHistory[year][month] || [];
            } else {
                return "History not found for the given month and year";
            }
        },
        historyByYear: (year) => {
            return inMemoryHistory[year] = {}
        },
        historyByClient: (year,month, client) => {
            return inMemoryHistory[year][month].client[client];
        },
    },
    add: {
        historyAttachment: (clientName, month, year, file) => {
            if (!inMemoryHistory[year]) {
                inMemoryHistory[year] = {};
            }
            if (!inMemoryHistory[year][month]) {
                inMemoryHistory[year][month] = { client: { [clientName]: [] } };
            } else if (!inMemoryHistory[year][month].client) {
                inMemoryHistory[year][month].client = { [clientName]: [] };
            } else if (!inMemoryHistory[year][month].client[clientName]) {
                inMemoryHistory[year][month].client[clientName] = [];
            }
    
            inMemoryHistory[year][month].client[clientName].push(file);
            return inMemoryHistory[year][month].client[clientName]
        }
    },
    update: {
        historyByMonth: (year, month, newMenuItems) => {
            if (inMemoryHistory[year][month]) {
                inMemoryHistory[year][month] = newMenuItems;
                return "History updated successfully";
            } else {
                return "History not found for the given month and year";
            }
        },
        historyByYear: (year) => {
            return inMemoryHistory[year]
        },
        historyByFilePath: (year, month, clientName, path) => {
            if (!inMemoryHistory[year][month]) {
                inMemoryHistory[year][month] = {
                    client:{
                        [clientName]: []
                    }
                };
            }
            return inMemoryHistory[year][month].client[clientName].push(path);
        },
        historyUpdateFileName: (year, month, client, oldFileName, newFileName) => {
            try {
                if (
                    inMemoryHistory[year] &&
                    inMemoryHistory[year][month] &&
                    inMemoryHistory[year][month].client &&
                    inMemoryHistory[year][month].client[client]
                ) {
                    const clientInvoices = inMemoryHistory[year][month].client[client];
                    const index = clientInvoices.indexOf(oldFileName);
                    if (index !== -1) {
                        // Update the filename
                        clientInvoices[index] = newFileName + ".pdf";
                        return `Filename '${oldFileName}' updated to '${newFileName}' for client '${client}' in ${month}, ${year}`;

                    } else {
                        return `Filename '${oldFileName}' not found for client '${client}' in ${month}, ${year}`;
                    }
                } else {
                    return "History not found for the given month, year, or client";
                }
            } catch (error) {
                return "An error occurred while updating the filename";
            }
        },
    },
    delete: (year, month, client, invoice) => {
        if (
            inMemoryHistory[year] &&
            inMemoryHistory[year][month] &&
            inMemoryHistory[year][month].client &&
            inMemoryHistory[year][month].client[client]
        ) {
            const invoices = inMemoryHistory[year][month].client[client];
            const index = invoices.indexOf(invoice);

            if (index !== -1) {
                invoices.splice(index, 1);
                return "Invoice deleted successfully";
            } else {
                return "Invoice not found for deletion";
            }
        } else {
            return "History not found for the given month, year, or client";
        }
    }
};

module.exports = historyModel;
