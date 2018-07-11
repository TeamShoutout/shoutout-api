var express = require('express');
var router = express.Router();
var Post = require('../database/models/post');

router.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    return res.json(posts)
  });
});

router.post('/', (req, res) => {
  let post = new Post();

  post.message = req.body.post.message;

  post.save().then(() => {
    return res.json({ post: post });
  });
});

module.exports = router;
