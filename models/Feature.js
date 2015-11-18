/*
 *  Feature.js  Feature model
 */

'use strict';

var shortid =   require('shortid');

var Feature = function (options) {
    
    options = options || {};
    
    this._id =          options.id || shortid.generate();
    
    this._creator =     options.creator;
    
    this._lastUpdator = options.lastUpdator;
    
    this._featureData = options.feature;
};

Feature.prototype.update = function (data) {
    
    for (var key in data) {
        this._featureData[key] = data[key];
    }
    
};

function ctr(args) {
    return Feature.apply(this, args);
}
ctr.prototype = Feature.prototype;
module.exports = function () {
    return new ctr(arguments);
};