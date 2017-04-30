'use strict';

const listingsParse = require('../lib/listingsParse.js');
const chai = require('chai');
const assert = chai.assert;


describe('Parse TV Listings', function () {
    describe('Request HTML', function () {
        it('retrieves the HTML document', function (done) {
            listingsParse.requestListings(function (data) {
                console.log('Test #1 starting...');
                assert.typeOf(data, 'string');
                console.log('Test #1 ending...');
                done();
            });
        });
    });

    describe('Parse Current Times', function () {
        it('retrieves the current times', function (done) {
            listingsParse.requestListings(function (data) {
                console.log('Test #2 starting...');
                listingsParse.parseCurrentListingsTimes(data, function (times) {
                    assert.typeOf(times, 'array');
                    assert.lengthOf(times, 6);
                    console.log('Test #2 ending...');
                    done();
                });
            });
        });
    });

    describe('Parse Current Shows', function () {
        it('retrieves the current shows', function (done) {
            listingsParse.requestListings(function (data) {
                console.log('Test #3 starting...');
                listingsParse.parseCurrentShows(data, function (shows) {
                    assert.typeOf(shows, 'object');
                    assert.lengthOf(Object.keys(shows), 78);
                    console.log('Test #3 ending...');
                    done();
                });
            });
        });
    });
});