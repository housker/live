const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
if(process.env.NODE_ENV === 'dev') require('dotenv').config();

exports.getDefaults = (ts, pts, cb) => {
    findDocuments(ts, pts, (res) => {
        cb(JSON.stringify(res));
    });
}

exports.insertUpdate = (ts, pts, data) => {
    original_id = new ObjectID();
    let timestamp = {
        "_id": original_id,
        "date": data.labels.date,
        "label": data.labels.label
    };
    ts.insert(timestamp);
    for(let i = 1; i < 4; i++) {
        let point = {};
        point.type = i;
        point.value = data[`values${i}`];
        point.date = data.labels.date;
        point.ts_id = original_id;
        pts.insert(point);
    }
}

function findDocuments(ts, pts, cb) { 
    results = {};
    let timestamps = new Promise ((resolve, reject) => {
        ts.find().limit(30).sort({$natural:-1}).toArray().then(res => {
            results.labels = res.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            resolve();
        });
    })
    let points1 = new Promise((resolve, reject) => {
        pts.find({ type: 1 }).limit(30).sort({$natural:-1}).toArray().then(res => {
            results.values1 = res.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            resolve();
        });
    })
    let points2 = new Promise((resolve, reject) => {
        pts.find({ type: 2 }).limit(30).sort({$natural:-1}).toArray().then(res => {
            results.values2 = res.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            resolve();
        });
    })
    let points3 = new Promise((resolve, reject) => {
        pts.find({ type: 3 }).limit(30).sort({$natural:-1}).toArray().then(res => {
            results.values3 = res.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            resolve();
        });
    })

    Promise.all([timestamps, points1, points2, points3])
    .then(() => {
        cb(results)
    })
    .catch(err => console.log(err));
}