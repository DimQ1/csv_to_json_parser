const { Transform } = require('stream');

module.exports = class TransformCsvToJson extends Transform {
    constructor(isHeader, headerLine) {
        super();
        this.transformedBytes = 0;
        this.isHeader = isHeader;
        this.headerLine = headerLine;
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
        this.transformedBytes += chunkLine.length;
        chunkLine.split('\r')
            .forEach((line) => {
                if (this.isHeader) {
                    this.push(`${line}\r`);
                    this.headerLine = line;
                    this.isHeader = false;
                } else if (this.headerLine !== line) {
                    this.push(`${line}\r`);
                }
            });
        done();
    }

    _flush(done) {
        if (this.unprocessedChankLine) {
            this.push(`${this.unprocessedChankLine}\r`);
        }
        done();
    }

    getHeader() {
        return this.headerLine;
    }
};
