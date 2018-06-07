const mongodb = require('mongodb');

/**
 * Creates a MongoDB client.
 * @param {Function} callback - The callback function.
 */
function createClient(callback) {
  // const mongoURL = 'mongodb://localhost:27017';
  const dbUser = encodeURIComponent(process.env.db_user);
  const dbPassword = encodeURIComponent(process.env.db_password);
  const dbHost = encodeURIComponent(process.env.db_host);
  const dbPort = encodeURIComponent(process.env.db_port);
  const dbName = encodeURIComponent(process.env.db_name);
  const mongoURL = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  mongodb.MongoClient.connect(mongoURL, (err, client) => {
    if (err) {
      throw err;
    }

    callback(client);
  });
}

/**
 * Connects the given MongoDB client to the database.
 * @param {Object} client - The MongoDB client.
 */
function connectDatabase(client) {
  const databaseName = process.env.db_name;

  return client.db(databaseName);
}

/**
 * Disconnects the given MongoDB client from the database.
 * @param {Object} client - The MongoDB client.
 */
function disconnectDatabase(client) {
  client.close();
}

/**
 * Inserts the given shows to the given database.
 * @param {Object[]} shows - The shows to insert.
 * @param {Object} db - The database to use.
 * @param {Function} callback - The callback function
 */
function insertShows(shows, db, callback) {
  const collection = db.collection('Shows');
  collection.insertMany(shows, (err, result) => {
    if (err) {
      throw err;
    }

    callback(result);
  });
}

/**
 * Finds all of the current shows in the given database.
 * @param {Object} db - The database to use.
 * @param {Object} callback - The callback function.
 */
function findCurrentShows(db, callback) {
  return findShows({ current: true }, db, callback);
}

/**
 * Finds all of the shows with the given name in the given database.
 * @param {String} showName - The show to find.
 * @param {Object} db - The database to use.
 * @param {Function} callback - The callback function.
 */
function findShowByName(showName, db, callback) {
  return findShows({ name: showName }, db, callback);
}

/**
 * Searches the Shows collection in the given database to find all of the show documents that match
 * the given search parameters.
 * @param {Object} option - The search parameters.
 * @param {Object} db - The database to use.
 * @param {Function} callback - The callback function.
 */
function findShows(option, db, callback) {
  const collection = db.collection('Shows');
  collection.find(option).toArray((err, docs) => {
    if (err) {
      throw err;
    }

    callback(docs);
  });
}

/**
 * Deletes all of existing the show documents in the Shows collection in the given database.
 * @param {Object} db - The database to use.
 * @param {Function} callback - The callback function.
 */
function deleteAll(db, callback) {
  const collection = db.collection('Shows');
  collection.deleteMany({}, (err, result) => {
    if (err) {
      throw err;
    }

    callback(result);
  });
}

/**
 * Deletes all of the show documents in the given database with a 'channel' property that matches
 * the given channel name.
 * @param {String} channel - The name of the channel.
 * @param {Object} db - The database to use.
 * @param {Function} callback - The callback function.
 */
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
module.exports.findCurrentShows = findCurrentShows;
module.exports.findShowByName = findShowByName;
module.exports.deleteAll = deleteAll;
module.exports.deleteShowsByChannel = deleteShowsByChannel;
