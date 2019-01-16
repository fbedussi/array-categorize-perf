const fs = require('fs');

const sampling = Number(process.argv[2]);

var fakeDilatation = 100;
const EIGHT_HOURS = 1000 * 60 * 60 * 8;

function updateAndGetFakeDilatation() {
    fakeDilatation = fakeDilatation + Math.random();

    return fakeDilatation;
}

let dataObj = [];
let dataArr = [];

const startTime = Date.now();

for (let timestamp = startTime; timestamp < startTime + EIGHT_HOURS; timestamp += sampling) {
    const dilatation = Math.trunc(updateAndGetFakeDilatation());
    // const timestampInSeconds = Math.trunc(timestamp / 1000);
    const timestampInSeconds = timestamp;

    dataObj.push({
        dilatation,
        timestamp: timestampInSeconds
    });
    dataArr.push([timestampInSeconds, dilatation]);
}

fs.writeFileSync(`fakedata-${sampling}-obj.json`, JSON.stringify(dataObj));
fs.writeFileSync(`fakedata-${sampling}-arr.json`, JSON.stringify(dataArr));