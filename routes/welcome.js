/*
 *  welcome.js  Welcome client when it connects
 */

'use strict';

function setup(client) {

    global.manager._getClientMap(client, function (client_map) {
        var clients = [];
        for (var id in client_map._clients) {
            if (id != client._id) {
                var otherclient = client_map._clients[id];
                clients.push({
                    id: otherclient._id,
                    viewport: otherclient._viewport
                });
            }
        }
        var features = [];
        for (var id in client_map._features) {
            features.push(client_map._features[id]);
        }

        client._socket.emit('welcome', {
            map: client._map,
            id: client._id,
            clients: clients,
            features: features
        });
    });
}

module.exports = {
    setup: setup
}