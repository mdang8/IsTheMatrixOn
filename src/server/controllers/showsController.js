const database = require('../lib/database.js');

/**
 * Uses the @function databaseCurrentShows to retrieve all of the current shows and sends the
 * unformatted array to the given response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.listCurrentShows = async function (req, res) {
  const shows = await databaseCurrentShows();

  res.status(200).send(shows);
};

/**
 * Uses the @function databaseCurrentShows to retrieve all of the current shows and creates an
 * array with each element representing a channel and its associated shows. Passes the array to
 * render the "channelShows" view template.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.listChannelShows = async function (req, res) {
  const shows = await databaseCurrentShows();
  const channelShowsList = [];
  // creates a set of all the unique channels
  const channels = new Set(shows.map(show => show.channel));
  channels.forEach((v, k, s) => {
    let channelShows = shows.filter(show => show.channel === v);
    channelShowsList.push({
      channel: v,
      shows: channelShows,
    });
  });

  // "channelShowsList" field assigned using ES6 object literal shorthand syntax
  res.render('channelShows', { title: 'Shows by Channel', channelShowsList });
};

/**
 * Makes a call to the database function to retrieve all of the show documents and returns an array
 * of all the 'name' property values.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.listShowNames = async function (req, res) {
  const client = await database.createClient();
  const db = database.connectDatabase(client);
  const shows = await database.findAllShows(db);
  const showNames = shows.map(show => show.name);
  database.disconnectDatabase(client);

  res.status(200).send(showNames);
};

/**
 * Makes a call to the database function to retrieve the show documents with a "show name" value
 * matching the show string in the given request's query parameters.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.searchShow = async function (req, res) {
  if (req.query.show) {
    const client = await database.createClient();
    const db = database.connectDatabase(client);
    const shows = await database.findShowByName(req.query.show, db);
    const showsData = formatShowsData(shows);
    database.disconnectDatabase(client);

    res.status(200).send(showsData);
  } else {
    res.status(400).send({ error: '"show" field not found in the request query parameters.' });
  }
};

/**
 * Makes a call to the database function to insert the given shows to the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createMultipleShows = async function (req, res) {
  const client = await database.createClient();
  const db = database.connectDatabase(client);
  const results = await database.insertShows(req.body, db);
  database.disconnectDatabase(client);

  res.status(200).send(results);
};

/**
 * Makes a call to the database function to delete all of the shows in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.deleteAllShows = async function (req, res) {
  const client = await database.createClient();
  const db = database.connectDatabase(client);
  const results = await database.deleteAll(db);
  database.disconnectDatabase(client);

  res.status(200).send(results);
};

/**
 * Makes a call to the database function to delete all of the shows for the given channel.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.deleteChannel = async function (req, res) {
  const client = await database.createClient();
  const db = database.connectDatabase(client);
  const results = await database.deleteShowsByChannel(req.body.channel, db);
  database.disconnectDatabase(client);

  res.status(200).send(results);
};

/**
 * Makes a call to the database function to get all of the current shows and returns a formatted
 * list.
 */
async function databaseCurrentShows() {
  const client = await database.createClient();
  const db = database.connectDatabase(client);
  const shows = await database.findCurrentShows(db);
  const showsData = formatShowsData(shows);
  database.disconnectDatabase(client);

  return showsData;
}

/**
 * Formats each show in the given array of shows to include the name, channel, start time, and
 * end time values.
 * @param {Object[]} shows - The shows to format
 */
function formatShowsData(shows) {
  // only includes the relevant fields for each show
  const formattedData = shows.map(show => ({
    name: show.name,
    channel: show.channel,
    startTime: show.startTime,
    endTime: show.endTime,
  }));

  return formattedData;
}
