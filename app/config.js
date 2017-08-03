var mongoose = require('mongoose');
var crypto = require('crypto');

mongoose.connect('mongodb://localhost/shortly');

var makeTimestampUpdate = function(schema) {
  schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
};

var links = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

links.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  console.log(this.code);
  next();
});

makeTimestampUpdate(links);

var users = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

makeTimestampUpdate(users);

module.exports.users = users;
module.exports.links = links;
