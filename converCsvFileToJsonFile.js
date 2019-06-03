/* eslint-disable no-console */
const { Transform } = require('stream');

const fs = require('fs');
const path = require('path');
const convertCsvRowToJson = require('./convertCsvRowToJson');

const csvFile = path.join(__dirname, 'test.csv');
const jsonFile = path.join(__dirname, 'test.json');

class TransformToJson extends Transform {
    constructor(separator) {
        super();
        this.separator = separator;
        this.headerLine = true;
        this.firstLine = true;
        this.unprocessedChankLine = null;
    }

    _transform(chunk, enc, done) {

        let chunkLine;
        if (this.unprocessedChankLine) {
            chunkLine = this.unprocessedChankLine + chunk.toString('utf8');
        } else {
            chunkLine = chunk.toString('utf8');
        }

        if (chunkLine.endsWith('\r')) {
            this.unprocessedChankLine = null;
        } else {
            const startIndexCropRow = chunkLine.lastIndexOf('\r');
            this.unprocessedChankLine = chunkLine.substring(startIndexCropRow + 1);
            chunkLine = chunkLine.substring(0, startIndexCropRow);
        }

        chunkLine.split('\r')
            .forEach((line) => {
                if (this.headerLine) {
                    convertCsvRowToJson.setHeader(line, this.separator);
                    this.push('[');
                    this.headerLine = false;
                } else {
                    const jsonLine = `${this.firstLine ? '' : ','}${convertCsvRowToJson.getJson(line, this.separator)}`;
                    this.push(jsonLine);

                    // eslint-disable-next-line no-undef
                    if (this.firstLine === true) { this.firstLine = false; }
                }
            });
        done();
    }

    _flush(done) {
        if (this.unprocessedChankLine) {
            const jsonLine = `${this.firstLine ? '' : ','}${convertCsvRowToJson.getJson(this.unprocessedChankLine)}`;
            this.push(jsonLine);
        }
        this.push(']');
        done();
    }
}

function processLineByLine(csvFileFullPath, jsonFileFullPath, separator = null) {
    try {
        const readeStream = fs.createReadStream(csvFileFullPath || csvFile);
        const writeStream = fs.createWriteStream(jsonFileFullPath || jsonFile);

        readeStream.pipe(new TransformToJson(separator))
            .pipe(writeStream);
    } catch (err) {
        console.error(err);
    }
}

processLineByLine();
