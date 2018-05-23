const MongoClient = require('mongodb').MongoClient;

function createClient(callback) {
  const mongoURL = 'mongodb://localhost:27017';

  MongoClient.connect(mongoURL, function (err, client) {
    if (err) {
      throw new Error('Error with connecting to MongoDB.');
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

  collection.insertMany(shows, function (err, result) {
    if (err) {
      throw new Error('Error with inserting shows.');
    }

    callback(result);
  });
}

function retrieveCurrentShows(db, callback) {
  const collection = db.collection('Shows');

  collection.find({ current: true }).toArray(function (err, docs) {
    if (err) {
      throw new Error('Error with retrieving current shows.');
    }

    callback(docs);
  });
}

module.exports.createClient = createClient;
module.exports.connectDatabase = connectDatabase;
module.exports.disconnectDatabase = disconnectDatabase;
module.exports.insertShows = insertShows;
module.exports.retrieveCurrentShows = retrieveCurrentShows;
