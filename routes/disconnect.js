/*
 *  disconnect.js   Handle socket disconnection
 */

'use strict';

function ondisconnect(client) {
    global.manager.unregisterClient(client, function () {
        
    });
}

function setup(client) {
    client._socket.on('disconnect', ondisconnect.bind(null, client));
}

module.exports = {
    setup: setup
};