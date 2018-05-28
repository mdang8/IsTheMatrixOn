'use strict';

const listingsParse = require('../lib/listingsParse.js');
const listingsSearch = require('../lib/listingsSearch.js');
const chai = require('chai');
const assert = chai.assert;

describe('Search TV Listings', function () {
    let htmlDocument = '';
    let showToSearch = '';

    it('searches for a non-existent show', function (done) {
        this.timeout(10000);
        showToSearch = '# not a real show #';
        listingsParse.requestListings((data) => {
            listingsSearch.searchShow(showToSearch, data, (results) => {
                htmlDocument = data;
                assert.typeOf(results, 'array');
                assert.equal(results.length, 0);
                done();
            });
        });
    });

    it('searches for a existing show', function (done) {
        listingsParse.parseCurrentShows(htmlDocument, (shows) => {
            showToSearch = shows[0].show;

            listingsSearch.searchShow(showToSearch, htmlDocument, (results) => {
                assert.typeOf(results, 'array');
                assert.isAtLeast(results.length, 1);
                done();
            });
        });
    });
});
