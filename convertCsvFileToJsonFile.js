/* eslint-disable no-console */
const { Transform } = require('stream');

const fs = require('fs');
const converterCsvRowToJson = require('./converterCsvRowToJson');

class TransformCsvToJson extends Transform {
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
                    converterCsvRowToJson.setHeader(line, this.separator);
                    this.push('[');
                    this.headerLine = false;
                } else {
                    const jsonLine = `${this.firstLine ? '' : ','}${converterCsvRowToJson.getJsonString(line, this.separator)}`;
                    this.push(jsonLine);

                    // eslint-disable-next-line no-undef
                    if (this.firstLine === true) { this.firstLine = false; }
                }
            });
        done();
    }

    _flush(done) {
        if (this.unprocessedChankLine) {
            const jsonLine = `${this.firstLine ? '' : ','}${converterCsvRowToJson.getJsonString(this.unprocessedChankLine, this.separator)}`;
            this.push(jsonLine);
        }
        this.push(']');
        done();
    }
}

module.exports = (csvFileFullPath, jsonFileFullPath, separator = null) => {
    try {
        const readeStream = fs.createReadStream(csvFileFullPath);
        const writeStream = fs.createWriteStream(jsonFileFullPath);

        readeStream.pipe(new TransformCsvToJson(separator))
            .pipe(writeStream);
    } catch (err) {
        console.error(err);
        throw err;
    }
};
