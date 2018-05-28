const showsController = require('./src/server/controllers/showsController');
const listingsParse = require('./src/server/lib/listingsParse');

function main() {
  listingsParse.requestListings((listings) => {
    const shows = listingsParse.parseCurrentShows(listings);
    showsController.createMultipleShows(shows, (results) => {
      console.log(results);
    });
  });
}

main();
