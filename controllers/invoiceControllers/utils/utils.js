const fs = require('fs');
const path = require('path');

const updateMemoFile =  (memoFilePath, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(memoFilePath, ',' + data , 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                const dataArray = data.split(',')
                resolve(dataArray);
            }
        });
    });
}

const deleteMemoFile =  (memoFilePath, memoName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(memoFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const dataArray = data.split(',')
                const index = dataArray.indexOf(memoName);
                if (index !== -1) {
                    dataArray.splice(index, 1); // Remove the item from the array
                }
                const updatedData = dataArray.join(',');
                fs.writeFile(memoFilePath, updatedData, 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.log('File updated successfully');
                    }
                });
            }
        });
    });
}

function readMemoFile(memoFilePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(memoFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const dataArray = data.split(',')
                resolve(dataArray);
            }
        });
    });
}

module.exports = {
    readMemoFile,
    updateMemoFile,
    deleteMemoFile
}