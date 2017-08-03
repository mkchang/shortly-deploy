var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');
var User = require('./app/models/user.js');
var user = new User({username: 'neal', password: 'test'});
console.log(user);

user.save(function(err, product) {
  console.log(user);
  user.comparePassword('nottest')
  .then((isMatch) => {
    console.log('compare password false: ', isMatch);
    user.comparePassword('test')
    .then((isMatch) => {
      console.log('compare password true: ', isMatch);
    });
  });
});

/*setTimeout(()=>console.log(user), 1000);*/

