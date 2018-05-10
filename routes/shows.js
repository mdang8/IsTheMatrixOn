const express = require('express');
const router = express.Router();

const showsController = require('../controllers/showsController');

router.get('/', function (req, res) {
  showsController.listCurrentShows(shows => {
    res.send(shows);
  });
});

router.post('/', function (req, res) {
  showsController.createShow(data => {
    res.send('OK.');
  });
});

module.exports = router;
