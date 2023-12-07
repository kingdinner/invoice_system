const fs = require('fs');
const path = require('path');

const updateMemoFile =  (memoFilePath, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(memoFilePath, data + ',', 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                const dataArray = data.split(',')
                resolve(dataArray);
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
    updateMemoFile
}