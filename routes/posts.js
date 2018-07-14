let express = require('express')
let axios = require('axios')
let router = express.Router()
let Post = require('../database/models/post')
let SlackToken = require('../database/models/slackToken')

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
  post.categories = post.message.match(/\B\#\w\w+\b/g)
  post.slackTeamId = req.body.team_id
  post.slackEnterpriseId = req.body.enterprise_id
  post.slackChannelId = req.body.channel_id
  post.slackSenderId = req.body.user_id
  post.slackRecipientId = post.message.substring(
    post.message.lastIndexOf('@') + 1, 
    post.message.lastIndexOf('|')
  )

  SlackToken.findOne({ slackTeamId: post.slackTeamId }).then((result) => {
    let slackToken = result.slackToken;

    let params1 = {
      token: slackToken,
      user: post.slackRecipientId
    }
    let query1 = Object.keys(params1)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params1[k]))
      .join('&')

    let params2 = {
      token: slackToken,
      user: post.slackSenderId
    }
    let query2 = Object.keys(params2)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params2[k]))
      .join('&')
  
    axios.all([
      axios.get('https://slack.com/api/users.info?' + query1),
      axios.get('https://slack.com/api/users.info?' + query2),
    ]).then(axios.spread((response1, response2) => {
      post.slackRecipientRealName = response1.data.user.profile.real_name_normalized
      post.slackRecipientEmail = response1.data.user.profile.email

      post.slackSenderRealName = response2.data.user.profile.real_name_normalized
      post.slackSenderEmail = response2.data.user.profile.email

      post.save().then(() => {
        res.status(200).json({
          text: 'Shoutout sent. Nice job!'
        })
      })
    }))

  })
})

module.exports = router
