/*
 *  Client.js   Client model
 */

'use strict';

var config =    require(__root + 'config.json');
var shortid =   require('shortid');

var Client = function (options) {
    
    options = options || {};
    
    this._socket =          options.socket;
    
    this._id =              shortid.generate();
    
    this._map =             options.map || config.default_map;
    
    this._map_credentials = options.map_credentials || config.default_map_credentials;
    
    this._viewport;
};

Client.prototype.setViewport = function (viewport) {
    
    this._viewport = viewport;
    
    this.notifyMyMap('viewportupdated', viewport);
};

Client.prototype.notifyMyMap = function (eventName, payload) {
    var data = {
        id: this._id
    };
    if (payload) { data.payload = payload; }
    this._socket.to(this._map).emit(eventName, data);
};

Client.prototype.notifyMySelf = function (eventName, payload) {
    var data = {
        id: this._id
    };
    if (payload) { data.payload = payload; }
    this._socket.emit(eventName, data);
};

function ctr(args) {
    return Client.apply(this, args);
}
ctr.prototype = Client.prototype;
module.exports = function () {
    return new ctr(arguments);
};