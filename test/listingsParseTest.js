'use strict';

const listingsParse = require('../lib/listingsParse.js');
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
    describe('Request HTML', function () {
        it('retrieves the HTML document', function (done) {
            listingsParse.requestListings(function (data) {
                assert.typeOf(data, 'string');
                done();
            });
        });
    });

    describe('Parse Current Times', function () {
        it('retrieves the current times', function (done) {
            listingsParse.requestListings(function (data) {
                listingsParse.parseCurrentListingsTimes(data, function (times) {
                    assert.typeOf(times, 'array');
                    assert.lengthOf(times, 6);
                    done();
                });
            });
        });
    });

    describe('Parse Current Shows', function () {
        it('retrieves the current shows', function (done) {
            listingsParse.requestListings(function (data) {
                listingsParse.parseCurrentShows(data, function (shows) {
                    assert.typeOf(shows, 'object');
                    assert.lengthOf(Object.keys(shows), 78);
                    console.log(shows);
                    done();
                });
            });
        });
    });
});