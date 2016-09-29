var conf = require('../config').conf;
var User = require('../models/apps').User;






/**
 * @api Configuration Fields
 * @apiVersion 1.0.0
 * @apiName Configuration
 * @apiGroup Configuration
 *
 * @apiDescription This section describe configuration File
 *
 *
 * @apiParam {Number} dbPort Contains the mongoDb Port number
 * @apiParam {String} dbHost Contains the mongoDb Host name
 * @apiParam {String} dbName Contains the mongoDb database name
 * @apiParam {Number} limit  Contains the default limit param used to paginate get response
 * @apiParam {Number} skip   Contains the default skip param used to paginate get response
 * @apiParam {String} logfile where to save log information
 * @apiParam {Array} userType Contains a list of Strings  User Type as inthe next example ["admin","crocierista" , "ente", "operatore"]
 * @apiParam {Array} appType Contains a list of Strings  application Type as inthe next example ["webuiMS", "ext", "user","ms"]
 * @apiParam {Array} msType  Contains a list of Strings  Microservices Type as inthe next example ["AppService" , "UsersService", "ContentsService","AuthMs","webuiMS"]. Do not remove AuthMs that is this
 * @apiParam {String} MyMicroserviceToken String containig the token for this Auth microservice. if not specifed is autogeneratd from this AuthMs
 *
 */




//Middleware to parse DB query fields selection from request URI
//Adds dbQueryFields to request
exports.parseFields = function(req, res, next){

  var fields = req.query.fields ? req.query.fields.split(","):null;
  if(fields){
        req.dbQueryFields = fields.join(' ');
  }
  else{
        req.dbQueryFields = null;
  }
  next();

};


//Middleware to parse pagination params from request URI
//Adds dbPagination to request
exports.parsePagination = function(req, res, next){

  var skip = req.query.skip && !isNaN(parseInt(req.query.skip)) ? parseInt(req.query.skip):conf.skip;
  var limit = req.query.limit && parseInt(req.query.limit) < conf.limit ? parseInt(req.query.limit):conf.limit;
  req.dbPagination = {"skip":skip, "limit":limit};
  next();
};


exports.parseOptions = function(req, res, next){

    var sortDescRaw = req.query.sortDesc ? req.query.sortDesc.split(",") : null;
    var sortAscRaw = req.query.sortAsc ? req.query.sortAsc.split(",") : null;


    if(sortAscRaw || sortDescRaw)
        req.sort={ asc:sortAscRaw, desc:sortDescRaw}
    else
        req.sort = null;

    next();
};

