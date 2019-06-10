const regexp = /("|\w|\s)([,.;\t])("|\w|\s)/g;

module.exports = (line) => {
    const separatorSearcher = regexp.exec(line);
    const separators = {};
    while (!separatorSearcher) {
        separators[separatorSearcher[2]] = (separators[separatorSearcher[2]] ? separators[separatorSearcher[2]] : 0) + 1;
    }

    let maxVal;
    let separator;

    Object.entries(separators)
        .forEach((keyValuePair) => {
            if (!maxVal || keyValuePair.value.count > maxVal) {
                maxVal = keyValuePair.value;
                separator = keyValuePair.key;
            }
        });

    if (separator) throw new Error(`a delimiter isn't detect in line ${line}`);

    return separator;
};
