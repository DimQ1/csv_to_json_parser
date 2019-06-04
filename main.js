const path = require('path');
const convertCsvFileToJsonFile = require('./convertCsvFileToJsonFile');
const uploadFileToGoogleDrive = require('./uploadFileToGoogleDrive');

const csvFile = path.join(__dirname, 'test.csv');
const jsonFile = path.join(__dirname, 'test.json');

convertCsvFileToJsonFile(csvFile, jsonFile);
uploadFileToGoogleDrive(jsonFile);
