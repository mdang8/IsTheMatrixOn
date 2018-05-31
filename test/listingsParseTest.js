const listingsParse = require('../src/server/lib/listingsParse');
const chai = require('chai');
const fs = require('fs');
const path = require('path');

const { assert } = chai;

/* eslint-disable prefer-arrow-callback */
describe('Parse TV Listings', () => {
  const testListingsPath = path.join(__dirname, './../testListings.html');
  const htmlDocument = fs.readFileSync(testListingsPath, 'utf8');

  it('retrieves the current times', function (done) {
    const times = listingsParse.parseCurrentListingsTimes(htmlDocument);
    assert.typeOf(times, 'array');
    assert.equal(Object.keys(times).length, 13);
    done();
  });

  it('retrieves the current shows', function (done) {
    const shows = listingsParse.parseCurrentShows(htmlDocument);
    assert.typeOf(shows, 'array');
    done();
  });

  it('retrieves all the unique channels', function (done) {
    const channels = listingsParse.getUniqueChannels(htmlDocument);
    assert.typeOf(channels, 'array');
    assert.equal(channels.length, 496);
    done();
  });


  // it('retrieves the HTML document', function (done) {
  //   this.timeout(10000);
  //   listingsParse.requestListings((data) => {
  //     htmlDocument = data;
  //     assert.typeOf(data, 'string');
  //     done();
  //   });
  // });
});
