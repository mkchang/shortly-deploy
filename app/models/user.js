var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var makeTimestampUpdate = require('../../lib/utility').makeTimestampUpdate;

var users = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

var hashPassword = function(password) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(password, null, null);
};

users.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  } else {
    hashPassword(user.password).then((hash) => {
      user.password = hash;
      next();
    }).catch((err) => {
      console.log(err);
    });
  }
});

users.methods.comparePassword = function(candidatePassword) {
  var compare = Promise.promisify(bcrypt.compare);
  return compare(candidatePassword, this.password);
};

makeTimestampUpdate(users);

var User = mongoose.model('user', users);

module.exports = User;
