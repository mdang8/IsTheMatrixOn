'use strict';

const listingsParse = require(__dirname + '/listingsParse.js');

module.exports = {
    searchShow: function (show, listings, callback) {
        listingsParse.parseCurrentShows(listings, (shows) => {
            let foundShows = [];
            for (let i = 0; i < shows.length; i++) {
                if (show === shows[i].show) {
                    foundShows.push(shows[i]);
                }
            }

            callback(foundShows);
        });
    }
};
