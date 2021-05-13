const path = require('path');
const fs = require('fs');
let all_data = {};

const files = fs.readdirSync(path.join(__dirname, 'data'));

if (files) {
    files.forEach(function(file) {
        const rawData = fs.readFileSync(require.resolve(path.join(__dirname, 'data', file)));
        const parsedData = JSON.parse(rawData);

        all_data = { ...all_data, ...parsedData };
    });
}

module.exports = () => all_data;
