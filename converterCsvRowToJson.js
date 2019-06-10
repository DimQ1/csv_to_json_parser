const detectSeparator = require('./detectSeparator');

module.exports = class ConverterCsvRowToJson {
    constructor(separator = null) {
        this.separator = separator;
        this.headers = [];
    }

    setHeader(csvHeader) {
        const detectedSeparator = this.separator || detectSeparator(csvHeader);
        this.headers = csvHeader ? csvHeader.split(detectedSeparator) : [];
    }

    getJsonString(csvRow) {
        const detectedSeparator = this.separator || detectSeparator(csvRow);
        const columns = csvRow.split(detectedSeparator);
        const objectRow = {};

        if (this.headers.length === columns.length) {
            columns.forEach((element, index) => {
                objectRow[this.headers[index]] = element;
            });
        } else {
            columns.forEach((element, index) => {
                objectRow[`column${index}`] = element;
            });
        }

        return JSON.stringify(objectRow);
    }
};
