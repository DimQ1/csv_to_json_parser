const { Transform } = require('stream');
const converterCsvRowToJson = require('./converterCsvRowToJson');

module.exports = class TransformCsvToJson extends Transform {
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
        chunkLine = null;
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
};
