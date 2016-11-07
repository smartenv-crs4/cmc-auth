

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
