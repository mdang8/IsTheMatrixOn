'use strict';

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let url = 'http://tvschedule.zap2it.com/tvlistings/ZCGrid.do?method=decideFwdForLineup&zipcode=02115&setMyPreference=false&lineupId=MA20483:-&aid=tvschedule';
let $;

module.exports = {
    testReturn: function (callback) {
        callback('Test successful.');
    },

    requestListings: function (callback) {
        request(url, (err, response, body) => {
            if (err && response.statusCode !== 200) {
                throw 'Error with retrieving listings: ' + err;
            }

            callback(body);
        });
    },

    updateListingsFile: function (callback) {
        let listingsFile = 'listings.txt';

        this.requestListings((data) => {
            // HTML comment of current date-time
            let dateComment = '<!--Data retrieved: ' + new Date() + '-->';
            // adds timestamp comment to top of HTML source code text
            let timestampedData = dateComment + '\n' + data;

            // writes the requested HTML document to a file
            fs.writeFile(listingsFile, timestampedData, (err) => {
                if (err) {
                    return console.error(err);
                }

                callback();
            });
        });
    },

    parseCurrentListingsTimes: function (htmlDocument, callback) {
        $ = cheerio.load(htmlDocument);
        let times = {};
        let timeCounter = 0;

        // gets the elements with the current times shown and iterates through each - this is a 3-hr range for shows
        $('.zc-tn-c').first().find('.zc-tn-t').each(function (i, elem) {
            // splits the text of the time (originally in the form 'X:XX XM', e.g. '4:30 PM')
            let timeSplit = $(this).text().split(' ');
            let hour = timeSplit[0].split(':')[0];
            let minute = timeSplit[0].split(':')[1];
            let meridiem = timeSplit[1];

            // adds the time in the element to the times object
            times[timeCounter] = {
                'hour': hour,
                'minute': minute,
                'meridiem': meridiem
            };

            // increments time counter to assign next value in the time object
            timeCounter += 1;

            // assigns the 15-minute interval times between each of the 6 current listing times (15 and 45)
            if (timeCounter < 10) {
                times[timeCounter] = {
                    'hour': hour,
                    'minute': minute === '00' ? '15' : '45',
                    'meridiem': meridiem
                };

                timeCounter += 1;
            }
        });

        callback(times);
    },

    parseCurrentShows: function (htmlDocument, callback) {
        $ = cheerio.load(htmlDocument);
        this.parseCurrentListingsTimes(htmlDocument, (times) => {
            let shows = [];
            let channel, showName;
            let timeAcc = 0;
            // size of a time slot (style width of 75px = 15 minutes)
            const blockSize = 75;

            // go through each channel
            $('.zc-row').each(function (i, elem) {
                // text value of the channel name
                channel = $(this).find('.zc-st').find('.zc-st-c').find('.zc-st-a').text();
                // go through each show on the channel
                $(this).find('.zc-pg').each(function (j, e) {
                    // text value of the show name
                    showName = $(this).find('.zc-pg-t').text();
                    let showStyle = $(this).attr('style');
                    let showTime = '';

                    // **the last show on a channel does not have a style attribute**
                    if (showStyle !== undefined) {
                        let widthIndex = showStyle.indexOf('width:');
                        let pxIndex = showStyle.indexOf('px');
                        // value of the width is between 'width:' and 'px' in the style string
                        let widthValue = parseInt(showStyle.substring(widthIndex + 'width:'.length, pxIndex));
                        showTime = times[timeAcc];
                        // adds filled time slots to time accumulator
                        timeAcc += Math.floor(widthValue / blockSize);
                    } else {
                        showTime = times[timeAcc];
                    }

                    // adds object with show data to the array of shows
                    shows.push({
                        'show': showName,
                        'channel': channel,
                        'time': showTime
                    });
                });

                // resets time accumulator
                timeAcc = 0;
            });

            callback(shows);
        });
    },

    parseUniqueChannels: function (htmlDocument, callback) {
        this.parseCurrentShows(htmlDocument, (shows) => {
            let uniqueChannels = [];
            for (let i = 0; i < shows.length; i++) {
                // checks if the show's channel is not in the unique channels array
                if (!uniqueChannels.includes(shows[i].channel)) {
                    uniqueChannels.push(shows[i].channel);
                }
            }

            callback(uniqueChannels);
        });
    }
};
