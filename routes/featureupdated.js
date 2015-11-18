/*
 *  featureupdated.js Feature updated
 */

'use strict';

function onfeatureupdated(client, payload) {

    global.manager._getClientMap(client, function (map) {
        var feature;
        if (feature = map.updateFeature(payload)) {
            client.notifyMyMap('featureupdated', feature);
        }
    });
}

function setup(client) {
    client._socket.on('featureupdated', onfeatureupdated.bind(null, client));
}

module.exports = {
    setup: setup
};