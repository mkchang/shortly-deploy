var mongoose = require('mongoose');
var schemas = require('./app/config.js');
var Link = mongoose.model('Link', schemas.links);
var link = new Link({url: 'https://www.google.com'});
console.log(link);
link.save(function(err, doc){
  console.log(err);
  console.log(doc);
});