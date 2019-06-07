const { Transform } = require('stream');
const ConverterCsvRowToJson = require('./ConverterCsvRowToJson');

module.exports = class TransformCsvToJson extends Transform {
    constructor(separator) {
        super();
        this.isHeaderLine = true;
        this.isFirstLine = true;
        this.unprocessedChankLine = '';
        this.ConverterCsvRowToJson = new ConverterCsvRowToJson(separator);
    }

    _transform(chunk, encoding, done) {
        const unitedChunk = this.unprocessedChankLine + chunk;
        const startIndexCropRow = unitedChunk.lastIndexOf('\r');
        const processingLine = unitedChunk.endsWith('\r') ? unitedChunk : unitedChunk.substring(0, startIndexCropRow);

        this.unprocessedChankLine = unitedChunk.endsWith('\r') ? '' : unitedChunk.substring(startIndexCropRow + 1);

        processingLine.split('\r')
            .forEach((line) => {
                if (this.isHeaderLine) {
                    this.ConverterCsvRowToJson.setHeader(line);
                    this.push('[');
                    this.isHeaderLine = false;
                } else {
                    const jsonLine = `${this.isFirstLine ? '' : ','}${this.ConverterCsvRowToJson.getJsonString(line)}`;
                    this.push(jsonLine);
                    if (this.isFirstLine) { this.isFirstLine = false; }
                }
            });
        done();
    }

    _flush(done) {
        if (this.unprocessedChankLine) {
            const jsonLine = `${this.isFirstLine ? '' : ','}${this.ConverterCsvRowToJson.getJsonString(this.unprocessedChankLine)}`;
            this.push(jsonLine);
        }
        this.push(']');
        done();
    }
};
