/* eslint-disable no-console */
const convertCsvFileToJsonFile = require('./convertCsvFileToJsonFile');
const uploadFileToGoogleDrive = require('./uploadFileToGoogleDrive');

const correctExampleParametrs = 'Plesure input correct parameters for example: '
    + '--sourceFile "D:\\source.csv" --resultFile "D:\\result.json" --separator ","';

(async () => {
    try {
        const sourceFileArg = process.argv[2] === '--sourceFile';
        const resultFileArg = process.argv[4] === '--resultFile';
        const separatorArg = process.argv.indexOf('--separator');

        if (sourceFileArg && resultFileArg) {
            const csvFilePath = process.argv[3];
            const jsonFilePath = process.argv[5];
            const separator = separatorArg > 1 ? process.argv[separatorArg + 1] : null;
            if ((separator ? separator.length : 0) > 1) throw new Error('the separator cannot consist of more than one symbol');
            await convertCsvFileToJsonFile(csvFilePath, jsonFilePath, separator || null);
            await uploadFileToGoogleDrive(jsonFilePath);
        } else {
            console.log(correctExampleParametrs);
        }
    } catch (err) {
        console.log(err);
    }
})();
