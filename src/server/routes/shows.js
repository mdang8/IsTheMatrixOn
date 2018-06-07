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
  showsController.createMultipleShows(req, res);
});

router.delete('/', (req, res) => {
  showsController.deleteChannel(req, res);
});

module.exports = router;
