const express = require('express');
const router = express.Router();

const showsController = require('../controllers/showsController');

router.get('/', function (req, res) {
  showsController.listCurrentShows(req, res);
});

router.get('/channel-shows', function (req, res) {
  showsController.listChannelShows(req, res);
});

router.post('/', function (req, res) {
  showsController.createMultipleShows(req.body, results => {
    res.status(200).send(results);
  });
});

module.exports = router;
