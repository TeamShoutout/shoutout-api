var express = require('express')
var router = express.Router()
var Post = require('../database/models/post')

router.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    return res.json(posts)
  })
})

router.post('/', (req, res) => {
  let post = new Post()

  post.message = req.body.post.message

  post.save().then(() => {
    return res.json({ post: post })
  })
})

router.post('/slack-command', (req, res) => {
  let post = new Post()

  // Gather all params we care about
  post.message = req.body.text
  post.slackTeamId = req.body.team_id
  post.slackEnterpriseId = req.body.enterprise_id
  post.slackChannelId = req.body.channel_id
  post.slackSenderId = req.body.user_id
  post.slackSenderUsername = req.body.user_name
  post.categories = post.message.match(/\B\#\w\w+\b/g)

  // Store only one id in this array for now -- in the future we may want to store more
  post.slackRecipientIds = [post.message.substring(
    post.message.lastIndexOf('@') + 1, 
    post.message.lastIndexOf('|')
  )]

  // Same here
  post.slackRecipientUsernames = [post.message.substring(
    post.message.lastIndexOf('|') + 1, 
    post.message.lastIndexOf('>')
  )]

  post.save().then(() => {
    res.status(200).json({
      text: 'Shoutout sent. Nice job!'
    })
  })
})

module.exports = router
