var { links } = require('../config');
var mongoose = require('mongoose');

var Link = mongoose.model('Link', links);

module.exports = Link;
