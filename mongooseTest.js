var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');
var User = require('./app/models/user.js');
var user = new User({username: 'neal', password: 'test'});
console.log(user);

user.save(function(err, results) {
  console.log(err, results);
  // user.comparePassword('nottest')
  // .then((isMatch) => {
  //   console.log('compare password false: ', isMatch);
  //   user.comparePassword('test')
  //   .then((isMatch) => {
  //     console.log('compare password true: ', isMatch);
  //   });
  // });
});

var user2 = new User({username: 'martin', password: 'test'});
user2.save(function(err, results) { console.log(err, results); });

setTimeout(() => {
  User.find({username: 'neal'}).then((results) => {
    console.log(3, results);
  });
}, 2000);

