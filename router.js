/*
 *  router.js   Route a socket connection to ourmap features
 */

'use strict';

var config = require('./config.json');

module.exports = function route(client) {
    
    var enabled_routes = config.enabled_routes;
    
    for (var i = 0; i < enabled_routes.length; ++i) {
        var route = require('./routes/' + enabled_routes[i]);
        if (route && route.setup) {
            route.setup(client);
        }
    }
    
};