var mongoose = require('mongoose');
var makeTimestampUpdate = require('../../lib/utility').makeTimestampUpdate;
var crypto = require('crypto');

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
  this.code = this.code ? 
    this.code : 
    shasum.digest('hex').slice(0, 5);
  console.log('PRE SAVE HOOK: this.code updated', this);
  next();
});

makeTimestampUpdate(links);

var Link = mongoose.model('Link', links);

module.exports = Link;
