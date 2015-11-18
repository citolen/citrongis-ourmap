/*
 *  featuredeleted.js Feature deleted
 */

'use strict';

function onfeaturedeleted(client, payload) {
    global.manager._getClientMap(client, function (map) {
        if (map.deleteFeature(payload)) {
            client.notifyMyMap('featuredeleted', {
                id: payload.id
            });
        }
    });
}

function setup(client) {
    client._socket.on('featuredeleted', onfeaturedeleted.bind(null, client));
}

module.exports = {
    setup: setup
};