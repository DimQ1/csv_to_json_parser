/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const TransformToBigCsv = require('./TransformToBigCsv');

const csvFileFullPath = path.join(__dirname, '..', 'test.csv');
const jsonFileFullPath = path.join(__dirname, 'testBig.csv');

const minFileSizeInBytes = 1000000000;

const pipelineCsv = (readeStream, writeStream, transformToBigCsv) => new Promise((resolve, reject) => {
    try {
        readeStream
            .pipe(transformToBigCsv)
            .pipe(writeStream)
            .on('finish', () => {
                const transformedBytes = transformToBigCsv.getTransformedBytesLength();
                if (transformedBytes < minFileSizeInBytes) {
                    resolve(
                        pipelineCsv(
                            fs.createReadStream(readeStream.path),
                            fs.createWriteStream(writeStream.path, { flags: 'a' }),
                            new TransformToBigCsv(false, transformToBigCsv.getHeader(), transformedBytes)
                        )
                    );
                } else {
                    resolve(transformedBytes);
                }
            });
    } catch (exception) {
        reject(exception);
    }
});

const loop = async () => {
    fs.writeFileSync(jsonFileFullPath, '');
    const transformedBytes = await pipelineCsv(
        fs.createReadStream(csvFileFullPath),
        fs.createWriteStream(jsonFileFullPath, { flags: 'a' }),
        new TransformToBigCsv(true)
    );
    console.log(transformedBytes);
};

loop()
    .then(() => console.log('all done!'));
