'use strict';

const listingsParse = require(__dirname + '/listingsParse.js');
const fs = require('fs');

module.exports = {
    readListings: function (callback) {
        // file containing the HTML source code of the requested TV listings page
        let listingsFile = __dirname + '/listings.txt';

        // checks if the file exists
        if (fs.existsSync(listingsFile)) {
            // reads the text file
            fs.readFile(listingsFile, 'utf8', (err, data) => {
                if (err) {
                    return console.error(err);
                }

                callback(data);
            });
        } else {
            // the file existence check failed, so requests the data from the source
            listingsParse.requestListings((data) => {
                callback(data);
            });
        }
    },

    searchShow: function (show, listings, callback) {
        listingsParse.parseCurrentShows(listings, (shows) => {
            // array to hold the "found" shows data
            let foundShows = [];
            // iterate through each show
            for (let i = 0; i < shows.length; i++) {
                // checks to see if the searched show name matches the current show
                if (show === shows[i].show) {
                    // adds the found show to the array
                    foundShows.push(shows[i]);
                }
            }

            callback(foundShows);
        });
    }
};
