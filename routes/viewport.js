/*
 *  viewport.js Handle changes in viewport
 */

'use strict';

function onviewportupdate(client, viewport) {
    client.setViewport(viewport);
}

function setup(client) {
    client._socket.on('viewportupdated', onviewportupdate.bind(null, client));
}

module.exports = {
    setup: setup
};