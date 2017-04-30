'use strict';

const request = require('request');
const cheerio = require('cheerio');

let url = 'http://tvschedule.zap2it.com/tvlistings/ZCGrid.do?method=decideFwdForLineup&zipcode=02115&setMyPreference=false&lineupId=MA20483:-&aid=tvschedule';
let $;

module.exports.requestListings = function (callback) {
    request(url, (err, response, body) => {
        if (err && response.statusCode !== 200) {
            throw 'Error with retrieving listings: ' + err;
        }

        callback(body);
    });
};

module.exports.parseCurrentListingsTimes = function (data, callback) {
    $ = cheerio.load(data);
    let times = [];

    // gets the elements with the current times shown and iterates through each - this is a 3-hr range for shows
    $('.zc-tn-c').first().find('.zc-tn-t').each(function (i, elem) {
        // adds the time in the element to the times array
        times[i] = $(this).text();
    });

    callback(times);
};

module.exports.parseCurrentShows = function (data, callback) {
    $ = cheerio.load(data);
    let shows = {};
    let channel, show;

    $('.zc-row').each(function (i, elem) {
        channel = $(this).find('.zc-st').find('.zc-st-c').find('.zc-st-a').text();
        shows[channel] = [];
        $(this).find('.zc-pg').each(function (j, e) {
            show = $(this).find('.zc-pg-t').text();
            shows[channel].push({
                'show': show,
                'time': ''
            });
        });
    });

    callback(shows);
};
