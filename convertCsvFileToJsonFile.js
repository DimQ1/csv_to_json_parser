/* eslint-disable no-console */
const fs = require('fs');
const TransformCsvToJson = require('./TransformCsvToJson');

module.exports = (csvFileFullPath, jsonFileFullPath, separator = null) => {
    try {
        if (!fs.existsSync(csvFileFullPath)) throw new Error(`csv file "${csvFileFullPath}" not exists`);
        if (jsonFileFullPath === undefined || jsonFileFullPath.length === 0) {
            throw new Error(`json file path "${jsonFileFullPath}" must consist of one symbol or more`);
        }

        const readeStream = fs.createReadStream(csvFileFullPath);
        const writeStream = fs.createWriteStream(jsonFileFullPath);

        console.log(`Start convert file ${csvFileFullPath}`);

        readeStream.pipe(new TransformCsvToJson(separator))
            .pipe(writeStream);
        console.log(`File "${csvFileFullPath}" converted to "${jsonFileFullPath}"`);
    } catch (err) {
        throw err;
    }
};
