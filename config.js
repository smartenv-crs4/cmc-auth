/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                         Copyright 2017 CRS4                                 *
 *       This file is part of CRS4 Microservice Core - Auth (CMC-Auth).       *
 *                                                                            *
 *       CMC-Auth is free software: you can redistribute it and/or modify     *
 *     it under the terms of the GNU General Public License as published by   *
 *       the Free Software Foundation, either version 3 of the License, or    *
 *                    (at your option) any later version.                     *
 *                                                                            *
 *       CMC-Auth is distributed in the hope that it will be useful,          *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        *
 *               GNU General Public License for more details.                 *
 *                                                                            *
 *       You should have received a copy of the GNU General Public License    *
 *       along with CMC-Auth.  If not, see <http://www.gnu.org/licenses/>.    *
 * ############################################################################
 */


var config = require('./config/default.json');
var async=require('async');
var argv = require('minimist')(process.argv.slice(2));

console.dir(argv);

var conf;


switch (process.env['NODE_ENV']) {
    case 'dev':
        conf = config.dev;
        break;
    case 'test':
        conf = config.dev;
        break;
    default:
        conf = config.production;
        break;
}


async.eachOf(conf, function(param, index,callback) {

    // Perform operation on file here.
    console.log('Processing Key ' + index);

    if(argv[index])
        conf[index]=argv[index];
    callback();
});



module.exports.conf = conf;
module.exports.generalConf = config;
