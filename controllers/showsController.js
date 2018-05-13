const database = require('../lib/database.js');
const listingsParse = require('../lib/listingsParse.js');

function index() {
  // @TODO
}

function listCurrentShows(req, res) {
  databaseCurrentShows(showsData => {
    res.status(200).send(showsData);
  });
}

function listChannelShows(req, res) {
  databaseCurrentShows(shows => {
    const channelShowsList = [];
    // creates a set of all the unique channels
    const channels = new Set(shows.map(show => show.channel));
    channels.forEach((v, k, s) => {
      let channelShows = shows.filter(show => show.channel === v);
      channelShowsList.push(
        {
          channel: v,
          shows: channelShows,
        }
      );
    });

    res.render('channelShows', { title: 'Shows by Channel', channelShowsList: channelShowsList });
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

function databaseCurrentShows(callback) {
  database.createClient(client => {
    const db = database.connectDatabase(client);
    database.retrieveCurrentShows(db, shows => {
      database.disconnectDatabase(client);
      // only includes the relevant fields for each show
      const showsData = shows.map(show => {
        return {
          show: show.show,
          channel: show.channel,
          startTime: show.startTime,
          endTime: show.endTime,
        };
      });

      callback(showsData);
    });
  });
}

module.exports.index = index;
module.exports.listCurrentShows = listCurrentShows;
module.exports.listChannelShows = listChannelShows;
module.exports.createMultipleShows = createMultipleShows;
