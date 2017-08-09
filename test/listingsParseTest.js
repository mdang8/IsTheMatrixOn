'use strict';

const listingsParse = require('../lib/listingsParse.js');
const listingsSearch = require('../lib/listingsSearch.js');
const chai = require('chai');
const assert = chai.assert;


describe('Test', function () {
    it('tests the test function', function (done) {
        listingsParse.testReturn(function (data) {
            assert.typeOf(data, 'string');
            assert.equal(data, 'Test successful.');
            done();
        });
    });
});

describe('Parse TV Listings', function () {
    let htmlDocument = '';

    it('retrieves the HTML document', function (done) {
        listingsParse.requestListings((data) => {
            htmlDocument = data;
            assert.typeOf(data, 'string');
            done();
        });
    });

    it('retrieves the current times', function (done) {
        listingsParse.parseCurrentListingsTimes(htmlDocument, function (times) {
            assert.typeOf(times, 'object');
            assert.equal(Object.keys(times).length, 11);
            done();
        });
    });

    it('retrieves the current shows', function (done) {
        listingsParse.parseCurrentShows(htmlDocument, function (shows) {
            assert.typeOf(shows, 'array');
            done();
        });
    });

    it('retrieves all the unique channels', function (done) {
        listingsParse.parseUniqueChannels(htmlDocument, function (channels) {
            assert.typeOf(channels, 'array');
            assert.equal(channels.length, 78);
            done();
        });
    });
});

