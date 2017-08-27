'use strict';

const listingsParse = require(__dirname + '/lib/listingsParse.js')
const schedule = require('node-schedule');
const fs = require('fs');

// scheduled to run every hour at minute 0
let job = schedule.scheduleJob('*/15 * * * *', function () {
    listingsParse.updateListingsFile(() => {
        let updateLogFile = __dirname + '/updateLog.txt';
        let logStr = 'Updated: ' + new Date() + '\n';

        if (!fs.existsSync(__dirname + '/updateLog.txt')) {
            fs.writeFile(updateLogFile, logStr, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            fs.appendFile(updateLogFile, logStr, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
});
