let headers = [];

module.exports = {
    setHeader: (csvHeader) => {
        headers = csvHeader ? csvHeader.split(',') : [];
    },
    getJson: (csvRow) => {
        const columns = csvRow.split(',');
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
