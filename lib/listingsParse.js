'use strict';

const request = require('request');
const cheerio = require('cheerio');

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

    parseCurrentListingsTimes: function (data, callback) {
        $ = cheerio.load(data);
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
        });

        callback(times);
    },

    parseCurrentShows: function (data, callback) {
        $ = cheerio.load(data);
        this.parseCurrentListingsTimes(data, (times) => {
            let shows = {};
            let channel, show, time, timeIndex;

            $('.zc-row').each(function (i, elem) {
                channel = $(this).find('.zc-st').find('.zc-st-c').find('.zc-st-a').text();
                shows[channel] = [];
                $(this).find('.zc-pg').each(function (j, e) {
                    show = $(this).find('.zc-pg-t').text();

                    time = determineShowTime($(this), times);
                    shows[channel].push({
                        'show': show,
                        'time': time
                    });
                });
            });

            callback(shows);
        });
    }
};

function determineShowTime(show, times) {
    let showStyle = show.attr('style');
    let blockSize = 150;
    let totalSize = blockSize * 6;
    let showTime = '';

    if (showStyle !== undefined) {
        let widthIndex = showStyle.indexOf('width:');
        let pxIndex = showStyle.indexOf('px');
        // value of the width is between 'width:' and 'px' in the style string
        let widthValue = showStyle.substring(widthIndex + 'width:'.length, pxIndex);
        showTime = times[Math.floor(parseInt(widthValue) / blockSize)];
    } else {
        showTime = 'null';
    }

    return showTime;
}
