/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const TransformToBigCsv = require('./TransformToBigCsv');

const csvFileFullPath = path.join(__dirname, 'test.csv');
const jsonFileFullPath = path.join(__dirname, 'testBig.csv');

const minFileSizeInBytes = 10000000000;

const pipelineCsv = (readeStream, writeStream, transformToBigCsv) => new Promise((resolve) => {
    readeStream.pipe(transformToBigCsv)
        .pipe(writeStream.on('finish', resolve));
});

const loop = async () => {
    let transformedBytes = 0;
    let transformToBigCsv = new TransformToBigCsv(true);
    while (transformedBytes < minFileSizeInBytes) {
        const readeStream = fs.createReadStream(csvFileFullPath);
        const writeStream = fs.createWriteStream(jsonFileFullPath, { flags: 'a' });
        try {
            // eslint-disable-next-line no-await-in-loop
            await pipelineCsv(readeStream, writeStream, transformToBigCsv);
            const headerLine = transformToBigCsv.getHeader();
            transformedBytes += transformToBigCsv.transformedBytes;
            transformToBigCsv = new TransformToBigCsv(false, headerLine);
        } catch (err) {
            console.error('Pipeline failed', err);
        }
    }
    console.log(transformedBytes);
};

loop()
    .then(() => console.log('all done!'));
