global.__root = __dirname + '/';

var http =      require('http');
var argv =      require('minimist')(process.argv.slice(2));
var config =    require('./config.json');
var router =    require('./router.js');
var Client =    require('./models/Client.js');
var Db =        require('tingodb')().Db;

global.db =         new Db('./db/', {});
global.mapsCollection = db.collection('maps');
global.featuresCollection = db.collection('features');

global.manager =    require('./manager.js')();


var server = http.createServer();
var port = argv.port || config.default_port;
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    var client = Client({
        socket:             socket,
        map:                socket.handshake.query.map,
        map_credentials:    socket.handshake.query.map_credentials
    });
    global.manager.registerClient(client, function (success) {
        if (success) {
            router(client);
        }
    });
});

server.listen(port);
console.log('server listening on', port);