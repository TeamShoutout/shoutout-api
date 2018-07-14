var mongoose = require('mongoose')
var autopopulate = require('mongoose-autopopulate')
var Schema = mongoose.Schema

var PostSchema = new Schema({
  message: { type: String },
  slackTeamId: { type: String, index: true },
  slackEnterpriseId: { type: String, index: true },
  slackChannelId: { type: String },
  slackSenderId: { type: String },
  slackSenderRealName: { type: String },
  slackSenderEmail: { type: String },
  slackRecipientId: { type: String },
  slackRecipientRealName: { type: String },
  slackRecipientEmail: { type: String },
  categories: [{ type: String }],
}, { timestamps: true })

PostSchema.plugin(autopopulate)

module.exports = mongoose.model('Post', PostSchema)
