let inMemoryHistory = {
    "2023": {
        "January": {
            "client": {
                "Joe": []
            }
        },
        "November": {
            "client": {
                "Joe": ["invoice_20231018110214.pdf", "invoice_20231018110432.pdf"]
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
            return inMemoryHistory[year][month].client[client].push(path);
        }
    }
};

module.exports = historyModel;
