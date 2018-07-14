let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')
let crypto = require('crypto')
let jwt = require('jsonwebtoken')
let Schema = mongoose.Schema
let autopopulate = require('mongoose-autopopulate')

let OrgSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, match: [/\S+@\S+\.\S+/, 'is invalid'], unique: true, index: true },
  hash: String,
  salt: String,
}, { timestamps: true })

OrgSchema.plugin(uniqueValidator, { message: 'is already taken' })
OrgSchema.plugin(autopopulate)

OrgSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

OrgSchema.methods.validPassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
}

OrgSchema.methods.generateJWT = function() {
  let today = new Date()
  let exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.JWT_SECRET)
}

OrgSchema.methods.toAuthJSON = function(){
  return {
    token: this.generateJWT(),
    id: this._id,
    name: this.name,
    channels: this.channels,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

module.exports = mongoose.model('Org', OrgSchema)
