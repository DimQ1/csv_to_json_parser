const detectSeparator = require('./detectSeparator');

let headers = [];

module.exports = {
    setHeader: (csvHeader, separator = null) => {
        const detectedSeparator = separator || detectSeparator(csvHeader);
        headers = csvHeader ? csvHeader.split(detectedSeparator) : [];
    },
    getJson: (csvRow, separator = null) => {
        const detectedSeparator = separator || detectSeparator(csvRow);
        const columns = csvRow.split(detectedSeparator);
        const objectRow = {};

        if (headers.length === columns.length) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < columns.length; i++) {
                objectRow[headers[i]] = columns[i];
            }
        } else {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < columns.length; i++) {
                objectRow[`column${i}`] = columns[i];
            }
        }

        return JSON.stringify(objectRow);
    }
};
