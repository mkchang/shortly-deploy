var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/connect');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.find({ url: uri }).then(function(found) {
    if (found[0]) {
      res.status(200).send(found[0]);
    } else {  
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save().then(function(newLink) {
          console.log('newlink', newLink);
          res.status(200).send(newLink);
        }).catch(function(err) {
          console.log('new link save error: ', err);
        });
      });
    } 
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user;
  User.find({ username: username })
  .then(function(results) {
    user = results[0];
    if (!user) {
      throw user;
    }
    return user;
  }).then(function(user) {
    return user.comparePassword(password);
  }).then(function(isMatch) {
    if (isMatch) {
      util.createSession(req, res, user);
    } else {
      throw user;
    }
  }).error(function(err) {
    console.warn(err);
  }).catch(function() {
    res.redirect('/login');
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user;

  User.find({ username: username })
  .then(function(results) {
    user = results[0];
    if (user) {
      throw user;
    }
    return user;
  }).then(function() {
    var newUser = new User({
      username: username,
      password: password
    });
    return newUser.save();
  }).then(function(newUser) {
    util.createSession(req, res, newUser);
  }).error(function(err) {
    console.warn(err);
  }).catch(function() {
    console.log('Account already exists');
    res.redirect('/signup');
  });
};

exports.navToLink = function(req, res) {
  var link;
  Link.find({ code: req.params[0] })
  .then(function(results) {
    link = results[0];
    if (!link) {
      throw link;
    }
    return link;
  }).then(function(link) {
    link.visits += 1;
    return link.save();
  }).then(function(link) {
    res.redirect(link.url);
  }).error(function(err) {
    console.warn(err);
  }).catch(function() {
    res.redirect('/');
  });
};