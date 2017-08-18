'use strict';

const listingsParse = require(__dirname + '/lib/listingsParse.js');
const listingsSearch = require(__dirname + '/lib/listingsSearch.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/matrix-status', (req, res) => {
    listingsParse.testReturn((data) => {
        res.send(data);
    });
});

app.get('/current-times', (req, res) => {
    listingsParse.requestListings((data) => {
        listingsParse.parseCurrentListingsTimes(data, (times) => {
            res.send(times);
        });
    });
});

app.get('/current-shows', (req, res) => {
    listingsParse.requestListings((data) => {
        listingsParse.parseCurrentShows(data, (shows) => {
            res.send(shows);
        });
    });
});

app.post('/search', (req, res) => {
    let showName = '';
    if (req.body.hasOwnProperty('show')) {
        showName = req.body.show;
    }

    listingsParse.requestListings((listings) => {
        listingsSearch.searchShow(showName, listings, (results) => {
            res.type('application/json');
            res.json(results);
        });
    });
});

