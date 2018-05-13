const request = require('request');
const database = require('./lib/database');
const listingsParse = require('./lib/listingsParse');

// listingsParse.requestListings(listings => {
//   let shows = listingsParse.parseCurrentShows(listings);
  
//   request.post({
//     headers: {
//       'content-type': 'application/json',
//     },
//     url: 'http://localhost:3000/shows',
//     body: shows,
//     json: true,
//   }, function (err, res, body) {
//     if (err) {
//       console.error(err);
//     }

//     console.log(body);
//   });
// });

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

    console.log(channelShowsList);
  });
});
