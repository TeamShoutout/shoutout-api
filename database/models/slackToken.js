var mongoose = require('mongoose')
var autopopulate = require('mongoose-autopopulate')
var Schema = mongoose.Schema

var SlackTokenSchema = new Schema({
  slackTeamId: { type: String, index: true },
  slackToken: { type: String },
}, { timestamps: true })

SlackTokenSchema.plugin(autopopulate)

module.exports = mongoose.model('SlackToken', SlackTokenSchema)
