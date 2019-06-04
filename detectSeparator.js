const regexp = /("|\w|\s)([,.;\t])("|\w|\s)/g;

module.exports = (line) => {
    let separatorSearcher;
    const separators = {};
    // eslint-disable-next-line no-cond-assign
    while ((separatorSearcher = regexp.exec(line)) !== null) {
        separators[separatorSearcher[2]] = (separators[separatorSearcher[2]] ? separators[separatorSearcher[2]] : 0) + 1;
    }

    let maxVal;
    let separator;

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(separators)) {
        if (!maxVal || value.count > maxVal) {
            maxVal = value;
            separator = key;
        }
    }
    if (separator === undefined || separator === null || separator === '') throw new Error(`a delimiter isn't detect in line ${line}`);

    return separator;
};
