var app = require('./server-config.js');

var foo = 'bar';
var port = 4568;
require('./app/connect.js');
app.listen(port);

console.log('Server now listening on port ' + port);
