var express = require('express');
var router = express.Router();
var Org = require('../database/models/org');
var passport = require('passport');
var auth = require('./auth');

/**
 * POST an org
 */
router.post('/', function(req, res, next) {
  var requestOrg = req.body.org
  var org = new Org()

  if (!requestOrg.password || requestOrg.password.length < 7) {
    res.status(422)
    res.json({ message: 'Please enter a password at least 7 characters long.' })
    return
  }

  org.name = requestOrg.name
	org.email = requestOrg.email
  org.setPassword(requestOrg.password)

  org.save();
  
  return res.json({ org: org.toAuthJSON() });
});

module.exports = router;
