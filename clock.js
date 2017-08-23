'use strict';

const listingsParse = require(__dirname + '/lib/listingsParse.js')
const schedule = require('node-schedule');

// scheduled to run every hour at minute 0
let job = schedule.scheduleJob('0 * * * *', function () {
    listingsParse.updateListingsFile();
});
