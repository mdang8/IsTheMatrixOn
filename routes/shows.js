const express = require('express');
const router = express.Router();

const showsController = require('../controllers/showsController');

router.get('/', function (req, res) {
  showsController.listCurrentShows(shows => {
    res.status(200).send(shows);
  });
});

router.post('/', function (req, res) {
  showsController.createMultipleShows(req.body, results => {
    res.status(200).send(results);
  });
});

module.exports = router;
