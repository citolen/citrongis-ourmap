/*
 *  featureadded.js Feature added
 */

'use strict';

var Feature =   require(__root + 'models/Feature.js');

function onfeatureadded(client, feature) {

    global.manager._getClientMap(client, function (map) {
        var temp_id =   feature.temp_id;
        feature = Feature({
            creator: client._id,
            feature: feature.data
        });
        map.addFeature(feature);
        client.notifyMyMap  ('featureadded', feature);
        client.notifyMySelf ('featureadded', {
            temp_id: temp_id,
            feature_id: feature._id
        });
    });
}

function setup(client) {
    client._socket.on('featureadded', onfeatureadded.bind(null, client));
}

module.exports = {
    setup: setup
};