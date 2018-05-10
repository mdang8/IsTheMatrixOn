const database = require('../lib/database.js');
const listingsParse = require('../lib/listingsParse.js');

function index() {
  // @TODO
}

function listCurrentShows(callback) {
  listingsParse.requestListings(listings => {
    const shows = listingsParse.parseCurrentShows(listings);

    callback(shows);
  });
}

function createShow(show, callback) {
  const model = database.createModel();

  database.connectDB(db => {
    database.addShow(show, model, db, () => {
      database.disconnectDB();
      callback(null);
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
module.exports.createShow = createShow;
