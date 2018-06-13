const showsController = require('./src/server/controllers/showsController');
const database = require('./src/server/lib/database');
const listingsParse = require('./src/server/lib/listingsParse');
const fs = require('fs');

function main() {
  listingsParse.requestListings(async (listings) => {
    const shows = listingsParse.parseCurrentShows(listings);
    const client = await database.createClient();
    const db = database.connectDatabase(client);
    const results = await database.insertShows(shows, db);
    database.disconnectDatabase(client);
    console.log(results.result);

    // fs.writeFile('./testListings.html', listings, (err) => {
    //   if (err) {
    //     throw err;
    //   }

    //   console.log('Test listings file has been written.');
    // });
  });
}

main();
