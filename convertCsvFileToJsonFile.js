/* eslint-disable no-console */
const fs = require('fs');
const TransformCsvToJson = require('./TransformCsvToJson');

module.exports = (csvFileFullPath, jsonFileFullPath, separator = null) => {
    if (!fs.existsSync(csvFileFullPath)) throw new Error(`csv file "${csvFileFullPath}" not exists`);
    if (!jsonFileFullPath) throw new Error(`json file path "${jsonFileFullPath}" must consist of one symbol or more`);
    const optionStream = { encoding: 'utf8' };
    const readeStream = fs.createReadStream(csvFileFullPath, optionStream);
    const writeStream = fs.createWriteStream(jsonFileFullPath, optionStream);

    console.log(`Start convert file ${csvFileFullPath}`);

    return new Promise((resolve, reject) => {
        try {
            readeStream
                .pipe(new TransformCsvToJson(separator))
                .pipe(writeStream)
                .on('finish', () => {
                    console.log(`File "${csvFileFullPath}" converted to "${jsonFileFullPath}"`);
                    resolve();
                });
        } catch (err) {
            reject(err);
        }
    });
};
