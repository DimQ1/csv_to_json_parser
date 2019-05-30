/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');

module.exports = function (fileName) {
    const filePath = path.join(__dirname, fileName);

    return function (textJoke) {
        fs.appendFile(filePath, textJoke, (err) => {
            if (err) throw err;
            console.log(textJoke);
        });
    };
};
