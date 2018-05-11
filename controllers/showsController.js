const database = require('../lib/database.js');
const listingsParse = require('../lib/listingsParse.js');

function index() {
  // @TODO
}

function listCurrentShows(callback) {
  database.createClient(client => {
    const db = database.connectDatabase(client);
    database.retrieveCurrentShows(db, shows => {
      database.disconnectDatabase(client);

      callback(shows);
    });
  });
}

function createSingleShow(show, callback) {
}

function createMultipleShows(shows, callback) {
  database.createClient(client => {
    const db = database.connectDatabase(client);
    database.insertShows(shows, db, results => {
      database.disconnectDatabase(client);

      callback(results);
    });
  });
}

function updateShow() {
  // @TODO
}

function deleteShow() {
  // @TODO
}

module.exports.index = index;
module.exports.listCurrentShows = listCurrentShows;
module.exports.createMultipleShows = createMultipleShows;
