'use strict';

const listingsParse = require(__dirname + '/lib/listingsParse.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.get('/', (req, res) => {
    console.log('Received GET request on "/"');
    console.log('__dirname: ' + __dirname);
    res.sendFile(__dirname + '/index.html');
});

app.get('/matrix-status', (req, res) => {
    listingsParse.testReturn((data) => {
        res.send(data);
    });
});

