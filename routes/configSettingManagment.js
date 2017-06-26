// @file jwtauth.js

var moment = require('moment');
var jwt = require('jwt-simple');
var conf=require('../config').conf;
var util=require('util');


exports.getParam = function(paramName) {
    return (conf[paramName] ||[]);
};

exports.setParam = function(paramName,paramValue) {
    conf[paramName]=paramValue;
};

exports.getConf = function() {
    return (conf);
};

