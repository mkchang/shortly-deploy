var app = require('./server-config.js');

var foo = 'bar';
var port = 4568;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/shortly');

app.listen(port);

console.log('Server now listening on port ' + port);
