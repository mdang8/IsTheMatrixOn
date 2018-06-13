const mongodb = require('mongodb');
require('dotenv').config();

/**
 * Creates a MongoDB client.
 * @param {function} callback - The callback function.
 */
exports.createClient = async function () {
  // const mongoURL = 'mongodb://localhost:27017';
  const dbUser = encodeURIComponent(process.env.DATABASE_USER);
  const dbPassword = encodeURIComponent(process.env.DATABASE_PASSWORD);
  const dbHost = encodeURIComponent(process.env.DATABASE_HOST);
  const dbPort = encodeURIComponent(process.env.DATABASE_PORT);
  const dbName = encodeURIComponent(process.env.DATABASE_NAME);
  const mongoURL = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  try {
    return mongodb.MongoClient.connect(mongoURL);
  } catch (err) {
    throw err;
  }
};

/**
 * Connects the given MongoDB client to the database.
 * @param {Object} client - The MongoDB client.
 */
exports.connectDatabase = function (client) {
  return client.db(process.env.DATABASE_NAME);
};

/**
 * Disconnects the given MongoDB client from the database.
 * @param {Object} client - The MongoDB client.
 */
exports.disconnectDatabase = function (client) {
  client.close();
};

/**
 * Inserts the given shows to the given database.
 * @param {Object[]} shows - The shows to insert.
 * @param {Object} db - The database to use.
 */
exports.insertShows = async function (shows, db) {
  const collection = db.collection('Shows');

  try {
    return collection.insertMany(shows);
  } catch (err) {
    throw err;
  }
};

/**
 * Finds all of the shows in the given database.
 * @param {Object} db - The database to use.
 */
exports.findAllShows = function (db) {
  return findShows({}, db);
};

/**
 * Finds all of the current shows in the given database.
 * @param {Object} db - The database to use.
 */
exports.findCurrentShows = function (db) {
  return findShows({ current: true }, db);
};

/**
 * Finds all of the shows with the given name in the given database.
 * @param {string} showName - The show to find.
 * @param {Object} db - The database to use.
 */
exports.findShowByName = function (showName, db) {
  return findShows({ name: showName }, db);
};

/**
 * Searches the Shows collection in the given database to find all of the show documents that match
 * the given search parameters.
 * @param {Object} option - The search parameters.
 * @param {Object} db - The database to use.
 */
async function findShows(option, db) {
  const collection = db.collection('Shows');

  try {
    return collection.find(option).toArray();
  } catch (err) {
    throw err;
  }
}

/**
 * Updates the "current" flag of all the old current shows.
 * @param {Object} db - The database to use.
 */
exports.updateNonCurrentShows = async function (db) {
  const collection = db.collection('Shows');

  try {
    return collection.updateMany({ current: true }, { $set: { current: false } });
  } catch (err) {
    throw err;
  }
};

/**
 * Deletes all of existing the show documents in the Shows collection in the given database.
 * @param {Object} db - The database to use.
 */
exports.deleteAll = async function (db) {
  const collection = db.collection('Shows');

  try {
    return collection.deleteMany({});
  } catch (err) {
    throw err;
  }
};

/**
 * Deletes all of the show documents in the given database with a 'channel' property that matches
 * the given channel name.
 * @param {string} channel - The name of the channel.
 * @param {Object} db - The database to use.
 */
exports.deleteShowsByChannel = async function (channel, db) {
  const collection = db.collection('Shows');

  try {
    return collection.deleteMany({ channel });
  } catch (err) {
    throw err;
  }
};
