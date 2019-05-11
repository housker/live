const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const assert = require('assert');
require('dotenv').config();
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;

MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
  const timestampsCollection = db.collection('timestamps');
  const pointsCollection = db.collection('points');
  insertDocuments(timestampsCollection, pointsCollection, () => console.log('inserted set of points'))
  client.close();
});


function insertDocuments(ts, pts, cb) {   
  let date = new Date();
  date.setMinutes(date.getMinutes() - 5);
  for(let i = 0; i < 30; i++) {
    original_id = new ObjectID();
    let timestamp = {
      "_id": original_id,
      "date": date,
      "label": date.toLocaleTimeString('it-IT')
    };
    ts.insert(timestamp);
    for(let type = 1; type < 4; type++) {
      let point = {};
      point.type = type;
      point.value = type;
      point.ts_id = original_id;
      pts.insert(point);
    }
    date.setSeconds(date.getSeconds() + 10);
  }
  cb();
}