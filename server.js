const express = require('express');
const app = express();
const http = require('http').createServer(app);
const CronJob = require('cron').CronJob;
const io = require('socket.io')(http);
const db = require('./db.js');
const MongoClient = require('mongodb').MongoClient;
if(process.env.NODE_ENV === 'dev') require('dotenv').config();
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const datab = new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, client) {
        if(err) reject(err);
        resolve(client.db(dbName));
    });
});

var count = 1;

app.use(express.static('dist/zt'));

app.get('/data', (req, res) => {
    datab
    .then(dbase => {
        db.getDefaults(dbase.collection('timestamps'), dbase.collection('points'), results => {
            res.end(results)
        });
    })
})

io.on('connection', function(socket){
    job.start();
    socket.on('data', function(data){
        datab
        .then(dbase => {
            let update = db.insertUpdate(dbase.collection('timestamps'), dbase.collection('points'), data);
            socket.emit('update', update);
        })
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

const job = new CronJob('* * * * * *', function() {
  if(count == 10) {
    let date = new Date();
    count = 1
    io.emit('ping', date);
  } else {
    count++
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});