const request = require('request');
const cheerio = require('cheerio');

function requestListings(callback) {
  const url = 'http://api-origin.zap2it.com/tvlistings/ZCGrid.do?method=decideFwdForLineup&zipcode=02115&setMyPreference=false&lineupId=MA20483:X';

  request(url, (err, res, body) => {
    if (err && res.statusCode !== 200) {
      throw new Error(`Error with retrieving listings: ${err}`);
    }

    callback(body);
  });
}

function parseCurrentListingsTimes(htmlDocument) {
  const $ = cheerio.load(htmlDocument);
  const times = [];

  // gets the elements with the current times shown and iterates through each - this is a 3-hr range for shows
  $('#zc-grid').find('.zc-tn-c').first().find('.zc-tn-t').each(function (i, element) {
    // splits the text of the time (originally in the form 'H:MM XM', e.g. '4:30 PM')
    let timeSplit = $(this).text().split(' ');
    let meridiem = timeSplit[1];
    let hour = (meridiem === 'AM') ?
      parseInt(timeSplit[0].split(':')[0], 10) % 12 :
      parseInt(timeSplit[0].split(':')[0], 10) + 12;
    let minute = parseInt(timeSplit[0].split(':')[1], 10);

    // @TODO - fix times array to contain Date objects

    // adds the time in the element to the times array
    times.push({
      hour,
      minute,
    });

    // assigns the 15-minute interval times between each of the 6 current listing times (15 and 45)
    // the minute values for the 6 current listing times are either '00' or '30'
    times.push({
      hour: hour,
      minute: (minute === 0) ? 15 : 45,
    });
  });

  times.push({
    hour: (parseInt(times[times.length - 1].hour) + 1) % 12,
    minute: (times[times.length - 1].minute === 15) ? 30 : 0,
  });

  return times;
}

function parseCurrentShows(htmlDocument) {
  const $ = cheerio.load(htmlDocument);
  const times = this.parseCurrentListingsTimes(htmlDocument);
  const currentDate = new Date();
  const shows = [];
  let channel = '';
  let showName = '';
  let timeAcc = 0;
  // regex for finding width style values (example string: "width:150px")
  const widthRegex = new RegExp('width:(.*)px');
  // size of a time slot (style width of 75px = 15 minutes)
  const blockSize = 75;

  // go through each channel
  $('.zc-row').each(function (i, element) {
    // text value of the channel name
    channel = $(this).find('.zc-st')
      .find('.zc-st-c')
      .find('.zc-st-a')
      .text();
    // go through each show on the channel
    $(this).find('.zc-pg').each(function (j, e) {
      // text value of the show name
      showName = $(this).find('.zc-pg-t')
        .text();
      let showStyle = $(this).attr('style');
      let startTime = null;
      let endTime = null;

      // **the last show on a channel does not have a style attribute**
      if (showStyle !== undefined) {
        // executes the regex to match the width value
        let widthValue = parseInt(widthRegex.exec(showStyle)[1], 10);
        startTime = times[timeAcc];
        // adds filled time slots to time accumulator
        timeAcc += Math.floor(widthValue / blockSize);
        endTime = times[timeAcc];
      } else {
        startTime = times[timeAcc];
        endTime = times[timeAcc];
      }

      // adds object with show data to the array of shows
      shows.push({
        name: showName,
        channel: channel,
        startTime: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          startTime.hour,
          startTime.minute
        ),
        endTime: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          endTime.hour,
          endTime.minute
        ),
        current: true,
      });
    });

    // resets time accumulator
    timeAcc = 0;
  });

  console.log(`Parsed ${shows.length} shows.`);

  return shows;
}

function getUniqueChannels(htmlDocument) {
  const shows = this.parseCurrentShows(htmlDocument);
  const uniqueChannels = [];
  shows.forEach(show => {
    // checks if the show's channel is not in the unique channels array
    if (!uniqueChannels.includes(show.channel)) {
      uniqueChannels.push(show.channel);
    }
  });

  return uniqueChannels;
}

module.exports.requestListings = requestListings;
module.exports.parseCurrentListingsTimes = parseCurrentListingsTimes;
module.exports.parseCurrentShows = parseCurrentShows;
module.exports.getUniqueChannels = getUniqueChannels;
