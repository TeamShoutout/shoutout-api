var express = require('express');
var router = express.Router();
var Post = require('../database/models/post');

router.get('/all', function(req, res) {
  return res.json({ posts: ['abc', 'def'] })
});

module.exports = router;
