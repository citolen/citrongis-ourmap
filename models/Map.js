/*
 *  Map.js  Map model
 */

'use strict';

var Feature = require('./Feature.js');

var Map = function (options, callback) {

    options = options || {};

    this._name = options.name;

    this._credentials = options.credentials;

    this._clients = {};

    this._features = {};
    this._loadFeatures(callback);
};

Map.prototype._loadFeatures = function (callback) {
    var self = this;
    global.featuresCollection.find({
        map_name: this._name
    }).toArray(function (err, docs) {
        if (err) {
            return console.error(err);
        }
        for (var i = 0; i < docs.length; ++i) {
            var doc = docs[i];
            var feature = Feature({
                id: doc.id,
                creator: doc.creator,
                feature: doc.featureData
            });
            self._features[feature._id] = feature;
        }
        if (callback) {
            callback(self);
        }
    });
};

Map.prototype.DB_addFeature = function (feature) {

    global.featuresCollection.update({
        id: feature._id
    }, {
        id: feature._id,
        map_name: this._name,
        creator: feature._creator,
        featureData: feature._featureData
    }, {
        upsert: true
    }, function (err, res) {
    });
};

Map.prototype.DB_updateFeature = function (feature) {

    global.featuresCollection.update({
        id: feature._id
    }, {
        '$set': {
            featureData: feature._featureData
        }
    }, function (err, res) {

    });
};

Map.prototype.DB_deleteFeature = function (id) {

    global.featuresCollection.remove({
        id: id
    }, function (err, res) {

    });
};

Map.prototype.addFeature = function (feature) {

    this._features[feature._id] = feature;
    this.DB_addFeature(feature);
};

Map.prototype.updateFeature = function (payload) {

    if (!(payload.id in this._features)) { return undefined; }

    var feature = this._features[payload.id];
    feature.update(payload.data);
    this.DB_updateFeature(feature);
    return feature;
};

Map.prototype.deleteFeature = function (payload) {

    if (!(payload.id in this._features)) { return undefined; }

    delete this._features[payload.id];
    this.DB_deleteFeature(payload.id);
    return true;
};

Map.prototype.registerClient = function (client) {

    if (client._id in this._clients) { return false; }

    if (client._map_credentials != this._credentials) { return false; }

    this._clients[client._id] = client;

    client._socket.join(this._name);

    client.notifyMyMap('newclient');

    return true;
};

Map.prototype.unregisterClient = function (client) {

    if (!(client._id in this._clients)) { return false; }

    delete this._clients[client._id];

    client.notifyMyMap('clientgone');

    client._socket.leave(this._name);

    return true;
};

function ctr(args) {
    return Map.apply(this, args);
}
ctr.prototype = Map.prototype;
module.exports = function () {
    return new ctr(arguments);
};