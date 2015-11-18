/*
 *  manager.js  Manage clients and maps
 */

'use strict';

var config =    require('./config.json');
var Map =       require('./models/Map.js');

var Manager = function (options) {

    options = options || {};

    this._maps = {};
};

Manager.prototype.DB_loadMap = function (name, callback) {
    var self = this;
    global.mapsCollection.findOne({
        name: name
    }, function (err, map) {
        if (err) {
            return callback(err);
        }
        Map({
            name: map.name,
            credentials: map.credentials
        }, function (newmap) {
            self._maps[name] = newmap;
            callback(null, newmap);
        });
    });
};

Manager.prototype.DB_saveMap = function (map) {
    global.mapsCollection.update({
        name: map._name,
    }, {
        name: map._name,
        credentials: map._credentials
    }, {
        upsert: true
    }, function (err, res) {
    });
};

Manager.prototype._getClientMap = function (client, callback) {
    var self = this;
    var client_map;
    if (client._map in this._maps) {
        callback(this._maps[client._map]);
    } else {
        this.DB_loadMap(client._map, function (err, map) {
            if (!err && map) {
                return callback(map);
            }
            Map({
                name: client._map,
                credentials: client._map_credentials
            }, function (map) {
                self._maps[map._name] = map;
                self.DB_saveMap(map);
                callback(map);
            });        
        });
    }
};

Manager.prototype.registerClient = function (client, callback) {
    var self = this;
    this._getClientMap(client, function (client_map) {
        if (client_map.registerClient(client)) {
            return callback(true);
        } else {
            self.kick(client);
            return callback(false);
        }
    });
};

Manager.prototype.unregisterClient = function (client, callback) {
    var self = this;
    this._getClientMap(client, function (client_map) {
        if (client_map.unregisterClient(client)) {
            self.kick(client);
            return callback(true);
        } else {
            return callback(false);
        }
    });
};

Manager.prototype.kick = function (client) {
    client._socket.disconnect();
};

function ctr(args) {
    return Manager.apply(this, args);
}
ctr.prototype = Manager.prototype;
module.exports = function () {
    return new ctr(arguments);
};