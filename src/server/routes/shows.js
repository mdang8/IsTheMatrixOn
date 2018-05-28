const express = require('express');
const router = express.Router();

const showsController = require('../controllers/showsController');

router.get('/', (req, res) => {
  showsController.listCurrentShows(req, res);
});

router.get('/search', (req, res) => {
  showsController.searchShow(req, res);
});

router.get('/channel-shows', (req, res) => {
  showsController.listChannelShows(req, res);
});

router.post('/', (req, res) => {
  showsController.createMultipleShows(req.body, (results) => {
    res.status(200).send(results);
  });
});

module.exports = router;
