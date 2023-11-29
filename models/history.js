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
    update: {
        historyByMonth: (year, month, newMenuItems) => {
            if (inMemoryHistory[year] && inMemoryHistory[year][month]) {
                inMemoryHistory[year][month] = newMenuItems;
                return "History updated successfully";
            } else {
                return "History not found for the given month and year";
            }
        },
        historyByYear: (year) => {
            return inMemoryHistory[year]
        },
        historyByFilePath: (year, month, client, path) => {
            try {
                return inMemoryHistory[year][month].client[client].push(path);
            } catch (error) {
                return inMemoryHistory[year][month]["client"][client] = [path];
            }
        }
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
