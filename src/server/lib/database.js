const mongodb = require('mongodb');

function createClient(callback) {
  const mongoURL = 'mongodb://localhost:27017';

  mongodb.MongoClient.connect(mongoURL, (err, client) => {
    if (err) {
      throw err;
    }

    callback(client);
  });
}

function connectDatabase(client) {
  const databaseName = 'IsTheMatrixOn';

  return client.db(databaseName);
}

function disconnectDatabase(client) {
  client.close();
}

function insertShows(shows, db, callback) {
  const collection = db.collection('Shows');
  collection.insertMany(shows, (err, result) => {
    if (err) {
      throw err;
    }

    callback(result);
  });
}

function retrieveCurrentShows(db, callback) {
  const collection = db.collection('Shows');
  collection.find({ current: true }).toArray((err, docs) => {
    if (err) {
      throw err;
    }

    callback(docs);
  });
}

function retrieveShow(show, db, callback) {
  const collection = db.collection('Shows');
  // "show" field assigned using ES6 object literal shorthand syntax
  collection.find({ name: show }).toArray((err, docs) => {
    if (err) {
      throw new Error(`Error with retrieving show ${show}`, err);
    }

    callback(docs);
  });
}

function deleteAll(db, callback) {
  const collection = db.collection('Shows');
  collection.deleteMany({}, (err, result) => {
    if (err) {
      throw err;
    }

    callback(result);
  });
}

function deleteShowsByChannel(channel, db, callback) {
  const collection = db.collection('Shows');
  collection.deleteMany({ channel }, (err, result) => {
    if (err) {
      throw err;
    }

    callback(result);
  });
}

module.exports.createClient = createClient;
module.exports.connectDatabase = connectDatabase;
module.exports.disconnectDatabase = disconnectDatabase;
module.exports.insertShows = insertShows;
module.exports.retrieveCurrentShows = retrieveCurrentShows;
module.exports.retrieveShow = retrieveShow;
module.exports.deleteAll = deleteAll;
module.exports.deleteShowsByChannel = deleteShowsByChannel;
