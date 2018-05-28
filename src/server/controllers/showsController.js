const database = require('../lib/database.js');
// const listingsParse = require('../lib/listingsParse.js');

function index() {
  // @TODO
}

/**
 * Uses the @function databaseCurrentShows to retrieve all of the current shows and sends the
 * unformatted array to the given response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function listCurrentShows(req, res) {
  databaseCurrentShows((showsData) => {
    res.status(200).send(showsData);
  });
}

/**
 * Uses the @function databaseCurrentShows to retrieve all of the current shows and creates an
 * array with each element representing a channel and its associated shows. Passes the array to
 * render the "channelShows" view template.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function listChannelShows(req, res) {
  databaseCurrentShows((shows) => {
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

    // "channelShowsList" field assigned using ES6 object literal shorthand syntax
    res.render('channelShows', { title: 'Shows by Channel', channelShowsList });
  });
}

/**
 * Makes a call to the database function to retrieve the show documents with a "show name" value
 * matching the show string in the given request's query parameters.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function searchShow(req, res) {
  if (req.query.show) {
    database.createClient((client) => {
      const db = database.connectDatabase(client);
      database.retrieveShow(req.query.show, db, (results) => {
        database.disconnectDatabase(client);
        const showsData = formatShowsData(results);

        res.status(200).send(showsData);
      });
    });
  } else {
    throw new Error('Error: "show" field not found in the request query parameters.');
  }
}

/**
 * Makes a call to the database function to insert the given shows to the database.
 * @param {Object[]} shows - The shows to add to the database.
 * @param {function} callback - The callback function.
 */
function createMultipleShows(shows, callback) {
  database.createClient((client) => {
    const db = database.connectDatabase(client);
    database.insertShows(shows, db, (results) => {
      database.disconnectDatabase(client);

      callback(results);
    });
  });
}

function updateShow() {
  // @TODO
}

function deleteAllShows() {
  // @TODO
  database.createClient((client) => {
    const db = database.connectDatabase(client);
    database.deleteAll(db, (results) => {
      database.disconnectDatabase(client);
      console.log(results);
    });
  });
}

/**
 * Makes a call to the database function to get all of the current shows and passes a formatted
 * list to the given callback.
 * @param {function} callback - The callback function
 */
function databaseCurrentShows(callback) {
  database.createClient((client) => {
    const db = database.connectDatabase(client);
    database.retrieveCurrentShows(db, (shows) => {
      database.disconnectDatabase(client);
      const showsData = formatShowsData(shows);

      callback(showsData);
    });
  });
}

/**
 * Formats each show in the given array of shows to include the name, channel, start time, and
 * end time values.
 * @param {Object[]} shows - The shows to format
 */
function formatShowsData(shows) {
  // only includes the relevant fields for each show
  const formattedData = shows.map(show => {
    return {
      name: show.name,
      channel: show.channel,
      startTime: show.startTime,
      endTime: show.endTime,
    };
  });

  return formattedData;
}

module.exports.index = index;
module.exports.listCurrentShows = listCurrentShows;
module.exports.listChannelShows = listChannelShows;
module.exports.searchShow = searchShow;
module.exports.createMultipleShows = createMultipleShows;
module.exports.deleteAllShows = deleteAllShows;
