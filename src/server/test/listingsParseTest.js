const listingsParse = require('../lib/listingsParse');
const chai = require('chai');
const assert = chai.assert;

describe('Parse TV Listings', function () {
  let htmlDocument = '';

  it('retrieves the HTML document', function (done) {
    this.timeout(10000);
    listingsParse.requestListings((data) => {
      htmlDocument = data;
      assert.typeOf(data, 'string');
      done();
    });
  });

  it('retrieves the current times', function (done) {
    const times = listingsParse.parseCurrentListingsTimes(htmlDocument);
    assert.typeOf(times, 'object');
    assert.equal(Object.keys(times).length, 12);
    done();
  });

  it('retrieves the current shows', function (done) {
    const shows = listingsParse.parseCurrentShows(htmlDocument);
    assert.typeOf(shows, 'array');
    done();
  });

  it('retrieves all the unique channels', function (done) {
    const channels = listingsParse.parseUniqueChannels(htmlDocument);
    assert.typeOf(channels, 'array');
    assert.equal(channels.length, 496);
    done();
  });
});