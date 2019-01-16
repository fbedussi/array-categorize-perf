const {
    performance,
    PerformanceObserver,
} = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0].name, items.getEntries()[0].duration);
    performance.clearMarks();new Array(NUMBER_OF_CATEGORIES)
});
obs.observe({ entryTypes: ['measure'] });

const EIGHT_HOURS = 1000 * 60 * 60 * 8;
const NUMBER_OF_CATEGORIES = 5;
const SAMPLING_INTERVAL = 1000;

function getFakeData() {
    return Math.trunc(Math.random() * 1000);
}

function getFakeCategoryId() {
    return Math.trunc(Math.random() * NUMBER_OF_CATEGORIES)
}

function getFakeSample(timestamp) {
    return {
        categoryId: getFakeCategoryId(),
        timestamp,
        data: getFakeData(),
    }
}

let data = [];
const startTime = Date.now();

for (let timestamp = startTime; timestamp < startTime + EIGHT_HOURS; timestamp += SAMPLING_INTERVAL) {
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        data.push(getFakeSample(timestamp));
    }
}

function splitArray1(data) {
    performance.mark('startSpliltArray1');
    console.log('data Length', data.length);
    let results = [];
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        results[i] = data.reduce((categorySamples, sample) => {
            if (sample.categoryId === i) {
                categorySamples.push(sample);
            }
            return categorySamples;
        }, []);
        console.log(`n. of result ID ${i}`, results[i].length);
    }

    performance.mark('stopSplitArray1');
    performance.measure('splitArray1', 'startSplitArray1', 'stopSplitArray1');
}


function splitArray2(data) {
    performance.mark('startSpliltArray2');
    console.log('data Length', data.length);

    let results = [];
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        const splitResult = data.reduce((reduceResult, sample) => {
            if (sample.categoryId === i) {
                reduceResult.selectedData.push(sample);
            } else {
                reduceResult.remainingData.push(sample)
            }

            return reduceResult;
        },
            {
                selectedData: [],
                remainingData: [],
            }
        );
        results[i] = splitResult.selectedData;
        console.log(`n. of result ID ${i}`, results[i].length);

        data = splitResult.remainingData;
    }

    performance.mark('stopSplitArray2');
    performance.measure('splitArray2', 'startSplitArray2', 'stopSplitArray2');
}


function splitArray3(data) {
    performance.mark('startSpliltArray3');
    console.log('data Length', data.length);
    let results = [];
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        results[i] = data.filter((sample) => sample.categoryId === i);
        console.log(`n. of result ID ${i}`, results[i].length);
    }

    performance.mark('stopSplitArray3');
    performance.measure('splitArray3', 'startSplitArray3', 'stopSplitArray3');
}



function splitArray4(data) {
    performance.mark('startSpliltArray4');
    console.log('data Length', data.length);
    let results = [];
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        results[i] = [];
    }
    for (let i = 0; i < data.length; i++) {
        const sample = data[i];
        results[sample.categoryId][i] = sample;
    }
    results.forEach((result, i) => console.log(`n. of result ID ${i}`, result.length));

    performance.mark('stopSplitArray4');
    performance.measure('splitArray4', 'startSplitArray4', 'stopSplitArray4');
}

function splitArray5(data) {
    performance.mark('startSpliltArray5');
    console.log('data Length', data.length);
    let results = [new Array(data.length), new Array(data.length), new Array(data.length), new Array(data.length), new Array(data.length), new Array(data.length)];
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        results[i] = [];
    }
    for (let i = 0; i < data.length; i++) {
        const sample = data[i];
        results[sample.categoryId][i] = sample;
    }
    results.forEach((result, i) => {
        reuslt = result.filter((x) => x);
        console.log(`n. of result ID ${i}`, result.length)
    });

    performance.mark('stopSplitArray5');
    performance.measure('splitArray5', 'startSplitArray5', 'stopSplitArray5');
}



const run = {
    "1": () => splitArray1(data.slice()),
    "2": () => splitArray2(data.slice()),
    "3": () => splitArray3(data.slice()),
    "4": () => splitArray4(data.slice()),
    "5": () => splitArray5(data.slice()),
}

const selectedAlgorithm = process.argv[2];

run[selectedAlgorithm]();