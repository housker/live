const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config();
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;

MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
  dropDb(db, (results) => console.log('dropped collections'))
  client.close();
});

const dropDb = function(db, callback) {
    db.collection('points').drop()
    .then(() => callback('dropped the database'))
    .catch(err => console.log(err));
    db.collection('timestamps').drop()
    .then(() => callback('dropped the database'))
    .catch(err => console.log(err));
  }



