const { Transform } = require('stream');

module.exports = class TransformCsvToJson extends Transform {
    constructor(isHeader, headerLine, transformedBytes = 0) {
        super();
        this.transformedBytes = transformedBytes;
        this.isHeader = isHeader;
        this.headerLine = headerLine;
        this.unprocessedChankLine = null;
    }

    _transform(chunk, encoding, done) {
        const unitedChunk = this.unprocessedChankLine + chunk;
        const startIndexCropRow = unitedChunk.lastIndexOf('\r');
        const processingLine = unitedChunk.endsWith('\r') ? unitedChunk : unitedChunk.substring(0, startIndexCropRow);
        this.transformedBytes += this.isHeader
            ? this.writableLength
            : this.writableLength - Buffer.from(this.headerLine).length;
        processingLine.split('\r')
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
        if (this.unprocessedChankLine) this.push(`${this.unprocessedChankLine}\r`);
        done();
    }

    getTransformedBytesLength() {
        return this.transformedBytes;
    }

    getHeader() {
        return this.headerLine;
    }
};
