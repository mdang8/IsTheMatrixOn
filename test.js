const showsController = require('./src/server/controllers/showsController');
const listingsParse = require('./src/server/lib/listingsParse');
const fs = require('fs');

function main() {
  listingsParse.requestListings((listings) => {
    const shows = listingsParse.parseCurrentShows(listings);
    // showsController.createMultipleShows(shows, (results) => {
    //   console.log(results);
    // });

    fs.writeFile('./testListings.html', listings, (err) => {
      if (err) {
        throw err;
      }

      console.log('Test listings file has been written.');
    });
  });
}

main();
