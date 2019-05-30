/* eslint-disable no-console */
const { createInterface } = require('readline');
const fs = require('fs');
const path = require('path');
const convertCsvRowToJson = require('./convertCsvRowToJson');

const csvFile = path.join(__dirname, 'test.csv');
const jsonFile = path.join(__dirname, 'test.json');

function errHandler(err) {
    if (err) throw err;
}

function saveLineToFile(jsonFilePath) {
    fs.writeFile(jsonFilePath, '', errHandler);
    let prevLine;
    fs.appendFile(jsonFilePath, '[', errHandler);

    return (line, lastLine = false) => {
        if (lastLine) {
            fs.appendFile(jsonFilePath, `${prevLine}${line}`, errHandler);
            prevLine = null;
        } else if (prevLine && !lastLine) {
            fs.appendFile(jsonFilePath, `${prevLine},`, errHandler);
            prevLine = line;
        } else {
            prevLine = line;
        }
    };
}

function processLineByLine() {
    try {
        const saveJsonRow = saveLineToFile(jsonFile);
        const fileStream = fs.createReadStream(csvFile);
        const rl = createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let firstLine = true;

        rl.on('line', (line) => {
            if (firstLine) {
                convertCsvRowToJson.setHeader(line);
                firstLine = false;
            } else {
                saveJsonRow(convertCsvRowToJson.getJson(line));
            }
        });
        rl.on('close', () => {
            saveJsonRow(']', true);
            console.log('File end.');
        });
    } catch (err) {
        console.error(err);
    }
}

processLineByLine();
