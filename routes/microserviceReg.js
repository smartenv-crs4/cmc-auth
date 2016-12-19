var express = require('express');
var router = express.Router();
var Microservice = require('../models/microservices').Microservice;
var MicroserviceAuth = require('../models/authEndpoints').AuthEndPoint;
var jwtMiddle = require('./jwtauth');
//var config=require('../config').conf;
var commonfunctions=require('./commonfunctions');
var conf=require('./configSettingManagment');
var request = require('request');
var async=require('async');
var AuthEP = require('../models/authEndpoints').AuthEndPoint;
var _ = require('underscore')._;
var util=require('util');
var middlewares=require('./middlewares');

router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);




router.post('/actions/microservicelist/export', jwtMiddle.ensureIsAuthorized, function (req, res) {

    Microservice.findAll({},null,{},function(err,data){
        console.log(err + " " + JSON.stringify(data.microservices));
        if(err)
            return res.status(500).send({error:"Internal Error", error_message:err});
        else
            return res.status(200).send(data.microservices);
    });
});


router.post('/actions/microservicelist/import', jwtMiddle.ensureIsAuthorized, function (req, res) {


    var msList=req.body.microservicelist;
    if (!msList)
        return res.status(400).send({error: "BadRequest", error_message: "no microservicelist field provided"});

    var errorMsg=null;
    async.each(msList,function(microservice,callback){
        Microservice.create(microservice, function (err, mcsID) {
            if(err)
             errorMsg= errorMsg!=null ?    errorMsg + "\n\r------------------ \n\r " + err : err;
            callback();

        });
    },function(err){
        commonfunctions.updateMicroservice(function () {
            if(errorMsg)
                return res.status(409).send({error:"Conflict. Done with alerts", error_message:errorMsg});
            else
                return res.status(201).send({results:"done"});
        });
    });
});



router.post('/renewtoken', jwtMiddle.ensureIsAuthorized, function (req, res) {

    //console.log("!!!!!!!!!!!!!!!" + util.inspect(req.body));
    var serviceType = req.body.serviceType;
    if (!serviceType)
        return res.status(400).send({error: "BadRequest", error_message: "no serviceType provided"});

    var tokenV = JSON.parse(commonfunctions.generateMsToken(serviceType)).token;
    Microservice.findOneAndUpdate({name: serviceType}, {token: tokenV}, {new: true}, function (error, ute) {
        if (error || (!ute)) {
            //console.log("ERROR:" + (error || "No Microservice Type Found"));
            res.status(404).send({error: "NotFound", error_message: error || "No Microservice Type Found"});
        } else {
            //console.log("Info:Microservice Type Found");
            res.status(201).send({token: tokenV});
        }
    });

});


router.post('/signup', [jwtMiddle.ensureIsAuthorized], function (req, res) {

    //Authorization - anybody, without token
    if (!req.body) return res.status(400).send({error: 'request body missing'});

    var miroserviceName = req.body.name;
    var baseUrl = req.body.baseUrl;
    var color = req.body.color;
    var icon = req.body.icon;

    if (!miroserviceName) return res.status(400).send({
        error: 'BadREquest',
        error_message: "No microservice name provided"
    });
    if (!baseUrl) return res.status(400).send({error: 'BadREquest', error_message: "No url provided"});
    if (!color) return res.status(400).send({error: 'BadREquest', error_message: "No color provided"});
    if (!icon) return res.status(400).send({error: 'BadREquest', error_message: "No icon provided"});

    Microservice.findOne({name: miroserviceName}, function (err, val) {
        if (err) return res.status(500).send({error: 'internal Error', error_message: " problem saving microservice"});

        if (val) {
            return res.status(409).send({
                error: 'Conflict',
                error_message: "Microservice already registered at URL:" + val.baseUrl
            });
        } else {
            Microservice.create({
                name: miroserviceName,
                baseUrl: baseUrl,
                icon: icon,
                color: color
            }, function (err, mcsID) {

                if (err) return res.status(500).send({
                    error: 'internal Error',
                    error_message: "problem saving microservice " + err
                });

                commonfunctions.updateMicroservice(function () { //update microservice List
                    return res.status(201).send(mcsID);
                });
            });
        }
    });

});


router.delete('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    Microservice.findByIdAndRemove(id, function (err, content) {
        if (err) return res.status(500).send({
            error: "delete_error",
            error_message: 'Unable to delete microservice:' + err + ')'
        });
        if (_.isEmpty(content)) return res.status(404).send({
            error: "Not Found",
            error_message: 'no microservice found with id ' + id
        });

        AuthEP.remove({name: content.name}, function (err, contentRoles) {
            if (err) {
                Microservice.create(content, function (errC, contentN) {
                    if (errC) return res.status(409).send({
                        error: "Conflict",
                        error_message: 'Microservice deleted but authorization rules for this microservice should exixst'
                    });
                    return res.status(500).send({
                        error: "delete_error",
                        error_message: 'Unable to delete microservice:' + err + ')'
                    });
                });

            } else {
                commonfunctions.updateMicroservice(function () { //update microservice List
                    return res.status(200).send(content);
                });
            }
        });
    });

});


router.get('/actions/instances', [jwtMiddle.decodeToken, jwtMiddle.ensureIsAuthorized], function (req, res) {

    var url = conf.getParam("consulProtocol") + "://" + conf.getParam("consulHost") + ":" + conf.getParam("consulPort") + conf.getParam("consulServices");

    //console.log("Consule URL:" + url );

    request.get({
        url: url,
        headers: {'content-type': 'application/json'}
    }, function (error, response, body) {
        if (error) return res.status(500).send({error: "InernalError", error_message: error})
        else {

            var respToWebUI = {};

            Microservice.find({}, "name -_id", function (err, respArray) {
                if (err) return res.status(500).send({error: "InernalError", error_message: err})

                for (var msname in respArray) {
                    respToWebUI[respArray[msname]["name"]] = {instances: 0, locations: []};
                }

                var data = JSON.parse(body);

//              console.log("DATA:"+util.inspect(data));
                for (item in data) {
                    //                  console.log("ITEM:" + item + " data[item]:"+ util.inspect(data[item]) + " ###data[item].Sr##:"+ util.inspect(data[item].Service));
                    if (respToWebUI.hasOwnProperty([data[item].Service])) {
                        respToWebUI[data[item].Service].instances = respToWebUI[data[item].Service].instances + 1;
                        respToWebUI[data[item].Service].locations.push(data[item].Address + ":" + data[item].Port);
                    }
                    // else{
                    //     nginx=data[item].Service.indexOf("nginx-");
                    //     if(nginx>=0){
                    //         msnamenginx=data[item].Service.slice(- data[item].Service.indexOf("-") );
                    //         if(respToWebUI.hasOwnProperty(msnamenginx)){
                    //             respToWebUI[msnamenginx].nginx=data[item].Address;
                    //         }
                    //     }
                    // }
                }
                //   console.log("DATA RespToWebUI:"+util.inspect(respToWebUI));
                res.status(200).send(respToWebUI);
            });
        }
    });

});


router.get('/actions/healt/:name', [jwtMiddle.decodeToken, jwtMiddle.ensureIsAuthorized], function (req, res) {

    var respToWebUI = [];
    var nginxIp = [];
    var bUrl;

    var msName = (req.params.name).toString();

    if (!msName) return res.status(400).send({error: "BadRequest", error_message: "no ms name provided"})
    var url = conf.getParam("consulProtocol") + "://" + conf.getParam("consulHost") + ":" + conf.getParam("consulPort") + conf.getParam("consulHealth") + "/";

    async.parallel([
            function (callback) {
                request.get({
                    url: url + msName,
                    headers: {'content-type': 'application/json'}
                }, function (error, response, body) {
                    if (error) callback(error, "");
                    else {
                        var data = JSON.parse(body);
                        var ip;
                        var running = "no check controls set";
                        var color = "gold";

                        //console.log("Body: " + body);
                        for (item in data) {
                            //console.log("Item:" + JSON.stringify(data[item]));
                            ip = data[item].Service.Address + "  |-->  " + data[item].Service.Port;
                            for (check in data[item].Checks) {
                                //console.log("ServNmae:::" + JSON.stringify(data[item].Checks[check]));
                                if (data[item].Checks[check].ServiceName == msName)
                                    if (data[item].Checks[check].Status == "passing") {
                                        running = "running";
                                        color = "lightgreen";
                                    }
                                    else {
                                        running = "unreachable";
                                        color = "red";
                                    }
                            }

                            respToWebUI.push({ip: ip, running: running, color: color});
                        }
                        // console.log("DATA RespToWebUI:"+util.inspect(respToWebUI));
                        callback(null, 'one');

                    }
                });
            },
            function (callback) {
                request.get({
                    url: url + "nginx-" + msName,
                    headers: {'content-type': 'application/json'}
                }, function (error, response, body) {
                    if (error) callback(error, "");
                    else {
                        var data = JSON.parse(body);


                        for (item in data) {
                            //  console.log("Item:" + JSON.stringify(data[item]));
                            nginxIp.push({ip: data[item].Service.Address + "  |-->  " + data[item].Service.Port});
                        }
                        callback(null, 'two');
                    }
                });
            },
            function (callback) {
                Microservice.findOne({name: msName}, "baseUrl", function (err, resp) {
                    if (!err)
                        if (resp)
                            bUrl = resp.baseUrl;
                    callback(null, 'three');
                });
            }
        ],

        function (err, results) {
            if (err) return res.status(500).send({error: "InternalError", error_message: err});
            return res.status(200).send({nginx: nginxIp, service: respToWebUI, baseUrl: bUrl});
        });

});



/**
 * @api {post} /authms/authendpoint Create a new authorization rule
 * @apiVersion 1.0.0
 * @apiName Create a new authorization rule
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Creates a new authorization rule and returns it.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} name the name of the microservice whose access is managed by the rule
 * @apiParam {Object} body.microservice the microservice role dictionary. URI, authToken and method are mandatory fields.
 * @apiParam {String} body.microservice.URI URI of resource whose access is managed by the rule
 * @apiParam {String[]} body.microservice.authToken a list of token types allowed to access this resource managed by the rule
 * @apiParam {String} body.microservice.method HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the rule
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "microservice": {
 *               "URI":"/users",
 *               "authToken":["WebUI", "UserMS"],
 *               "method":"POST",
 *               "name":"authms"
 *              }
 *  }
 *
 * @apiSuccess (201 - OK) {String} URI URI of the resource
 * @apiSuccess (201 - OK) {String[]} authToken list of token types allowed to access the resource
 * @apiSuccess (201 - OK) {String} method HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the rule
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 201 CREATED
 *      {
 *        "_id":"9804H4334HFN......",
 *        "URI":"/users......",
 *        "method":"POST",
 *        "name":"authms",
 *        "authToken":["WebUI", "UserMS"]
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */

//router.post('/:name/authendpoint',jwtMiddle.ensureIsAuthorized, function (req, res) {
router.post('/authendpoint', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) return res.status(400).send({
        error: "BadREquest",
        error_message: 'request body missing'
    });
    var microservice = req.body.microservice;
    //var name = req.param('name').toString();
    // console.log("method:----->>>" + util.inspect(microservice));

    if (!microservice) return res.status(400).send({error: 'BadRequest', error_message: "No microservice provided"});
    if (!microservice.name) return res.status(400).send({
        error: 'BadRequest',
        error_message: "No microservice name provided"
    });
    if (!microservice.URI) return res.status(400).send({
        error: 'BadRequest',
        error_message: "No microservice URI provided"
    });
    if (!(microservice.authToken.length > 0)) return res.status(400).send({
        error: 'BadRequest',
        error_message: "No microservice authToken array list provided"
    });
    if (!microservice.method) return res.status(400).send({
        error: 'BadRequest',
        error_message: "No microservice method provided"
    });

    microservice.URI=microservice.URI.endsWith("/") ? microservice.URI : microservice.URI+"/";
    microservice.method=microservice.method.toUpperCase();

    AuthEP.findOne({URI: microservice.URI, method: microservice.method}, function (err, item) {
        if (err) return res.status(500).send({error: "InternalError", error_message: "Internal Error " + err});
        if (item) return res.status(409).send({
            error: "Duplicate",
            error_message: "roles " + microservice.method + " " + microservice.URI + " already exists"
        });
        try {

            AuthEP.create(microservice, function (err, newitem) {
                // console.log("Creatig USER" + err);
                if (err) {

                    return res.status(500).send({
                        error: "InternalError",
                        error_message: 'Unable to register microservice Auth Tokens (err:' + err + ')'
                    });
                }

                return res.status(201).send(newitem);
            });
        } catch (ex) {
            return res.status(500).send({
                error: "InternalError",
                error_message: 'Unable to register microservice Auth Tokens (err:' + ex + ')'
            });
        }
    });

});



/**
 * @api {get} /authms/authendpoint Get all authorization rules
 * @apiVersion 1.0.0
 * @apiName GetAuthRules
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Returns the paginated list of all endpoint rules.
 * Set pagination skip and limit in the URL request, e.g. "get /authms/authendpoint?skip=10&limit=50"
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {Number} skip pagination skip param
 * @apiParam {Number} limit pagination limit param
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/authendpoint', jwtMiddle.ensureIsAuthorized, function (req, res) {

    //given an authenticated user (by token)
    //console.log(req);

    var fields = req.dbQueryFields;
    var query = {};

    for (var v in req.query)
        if (AuthEP.schema.path(v)) {

            if(v.toString()=="URI")
                req.query[v]= req.query[v].endsWith("/") ?  req.query[v] :  req.query[v]+"/";
            else if(v.toString()=="method")
                req.query[v]= req.query[v].toUpperCase();

            query[v] = req.query[v];
        }

    AuthEP.findAll(query, fields, req.dbPagination, function (err, results) {

        if (!err) {

            if (!_.isEmpty(results.authendpoints))
                return res.status(200).send(results);
            else
                return res.status(404).send({error: "Not found", error_message: "Resource not found with this Id"});
        }
        else {
            return res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });

});



/**
 * @api {get} /authms/authendpoint:/name Get authorization rules of a given microservice
 * @apiVersion 1.0.0
 * @apiName GetMicroserviceAuthRules
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Returns the paginated list of all endpoint rules of a given microservice.
 * Set pagination skip and limit in the URL request, e.g. "get /authms/authendpoint?skip=10&limit=50"
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} name the name of the microservice
 * @apiParam {Number} skip pagination skip param
 * @apiParam {Object} limit pagination limit param
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
//router.get('/:name/authendpoint', jwtMiddle.ensureIsAuthorized, function(req, res) {
router.get('/authendpoint/:name', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (req.query.name)
        return res.status(400).send({error: 'BadRequest', error_message: "name is a Url param"});

    var name =  (req.params.name).toString();

    var fields = req.dbQueryFields;
    var query = {name: name};

    for (var v in req.query) {
        if (AuthEP.schema.path(v)) {

            if (v.toString() == "URI")
                req.query[v] = req.query[v].endsWith("/") ? req.query[v] : req.query[v] + "/";
            else if (v.toString() == "method")
                req.query[v] = req.query[v].toUpperCase();

            query[v] = req.query[v];
        }
    }


    AuthEP.findAll(query, fields, req.dbPagination, function (err, results) {

        if (!err) {
            if (!_.isEmpty(results.authendpoints))
                return res.status(200).send(results);
            else
                return res.status(404).send({error: "Not found", error_message: "Resources not found"});
        }
        else {
            return res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });

});



/**
 * @api {get} /authms/authendpoint/:id Get authorization rule by Id
 * @apiVersion 1.0.0
 * @apiName GetAuthRulesById
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access_token, it returns an authorization rule by id.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} id authorization rule id
 *
 * @apiSuccess (200 - OK) {String} _id  rule identifier
 * @apiSuccess (200 - OK) {String} name the name of the microservice whose access is managed by the rule
 * @apiSuccess (200 - OK) {String} URI  URI of resource whose access is managed by the rule
 * @apiSuccess (200 - OK) {String} method  HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the rule
 * @apiSuccess (200 - OK) {String[]} authToken list of token types allowed to access the resource
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *         {
 *            "_id": "543fdd60579e1281b8f6da92",
 *            "name": "authMS",
 *            "URI": "/users",
 *            "method":"GET",
 *            "authToken":["WebUI", "externalApp", "UserMS"]
 *         }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/authendpoint/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();
    var fields = req.dbQueryFields;

    AuthEP.findById(id, fields, function (err, content) {
        if (err) return res.status(404).send({
            error: "GET ERROR",
            error_message: 'Unable to read auth token (err:' + err + ')'
        });

        if (content)
            return res.status(200).send(content);
        else return res.status(404).send({error: "Not found", error_message: "Resource not found with this Id"});
    });

});



/**
 * @api {delete} /authms/authendpoint/:id Delete authorization rule by Id
 * @apiVersion 1.0.0
 * @apiName DeleteAuthRulesById
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access_token, it delete an authorization rule by id.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} id authorization rule id
 *
 * @apiSuccess (204 - NO CONTENT) {String} _id  rule identifier
 * @apiSuccess (204 - NO CONTENT) {String} name the name of the microservice whose access is managed by the rule
 * @apiSuccess (204 - NO CONTENT) {String} URI  URI of the resource whose access is managed by the rule
 * @apiSuccess (204 - NO CONTENT) {String} method  HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the rule
 * @apiSuccess (204 - NO CONTENT) {String[]} authToken a list of token types allowed to access the resource
 *
 * @apiSuccessExample {json} Example: 204 NO CONTENT
 *      HTTP/1.1 204 NO CONTENT
 *         {
 *            "_id": "543fdd60579e1281b8f6da92",
 *            "name": "authMS",
 *            "URI": "/users",
 *            "method":"GET",
 *            "authToken":["WebUI", "externalApp", "UserMS"]
 *         }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.delete('/authendpoint/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    AuthEP.findByIdAndRemove(id, function (err, content) {
        if (err) return res.status(500).send({
            error: "delete_error",
            error_message: 'Unable to delete auth Token (err:' + err + ')'
        });
        if (_.isEmpty(content)) return res.status(404).send({
            error: "NotFound",
            error_message: 'No role found whith id ' + id
        });

        return res.status(204).send(content);
    });

});



/**
 * @api {put} /authms/authendpoint/:id Update authorization rule by Id
 * @apiVersion 1.0.0
 * @apiName UpdateAuthRulesById
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Updates an authorization rule by id.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} id rule identifier
 * @apiParam {Object} body.microservice the microservice role dictionary with updatable fields defined below
 * @apiParam {String} body.microservice.URI URI of the resource whose access is managed by the rule
 * @apiParam {String[]} body.microservice.authToken a list of token types enabled to access to this resource that are subject of the rule.
 * @apiParam {String} body.microservice.method HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the rule
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "microservice": {
 *               "name":"AuthMs",
 *               "URI":"/users",
 *               "authToken":["WebUI", "UserMS"],
 *               "method":"POST"
 *              }
 *       }
 *
 * @apiSuccess (200 - OK) {String} _id  resource access rule id identifier
 * @apiSuccess (200 - OK) {String} name name of microservice which has set the rule.
 * @apiSuccess (200 - OK) {String} URI URI of resource on which has set the rule.
 * @apiSuccess (200 - OK) {String[]} authToken list of token types allowed to access the resource
 * @apiSuccess (200 - OK) {String} method HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the rule
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *         {
 *            "_id": "543fdd60579e1281b8f6da92",
 *            "name": "authMS",
 *            "URI": "/users",
 *            "method":"GET",
 *            "authToken":["WebUI", "externalApp", "UserMS"]
 *         }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.put('/authendpoint/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) return res.status(400).send({
        error: "BadREquest",
        error_message: 'request body missing'
    });
    var microservice = req.body.microservice;

    if (!microservice) return res.status(400).send({error: 'BadRequest', error_message: "No microservices provided"});
    if (microservice.name) return res.status(400).send({
        error: 'BadRequest',
        error_message: "microservice name can not be updated"
    });
    if (microservice._id) return res.status(400).send({
        error: 'BadRequest',
        error_message: "microservice _id can not be updated"
    });


    if(microservice.URI)
        microservice.URI=microservice.URI.endsWith("/") ? microservice.URI : microservice.URI+"/";

    if(microservice.method)
        microservice.method=microservice.method.toUpperCase();


    var id = (req.params.id).toString();

    AuthEP.findByIdAndUpdate(id, microservice, function (err, content) {
        if (err) return res.status(500).send({
            error: "update_error",
            error_message: 'Unable to update auth Token (err:' + err + ')'
        });
        if (!content) return res.status(404).send({error: "Nofound", error_message: 'not found auth Token'});
        return res.status(200).send(content);
    });

});


/**
 * @api {post} /authms/authendpoint/actions/export/:name Export authorization rules of a given microservice
 * @apiVersion 1.0.0
 * @apiName ExportMicroserviceAuthRules
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Returns an export list of all endpoint rules of a given microservice.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} name Url params containg the name of the microservice
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
//router.get('/:name/authendpoint', jwtMiddle.ensureIsAuthorized, function(req, res) {
router.post('/authendpoint/actions/export/:name', jwtMiddle.ensureIsAuthorized, function (req, res) {
//router.get('/authendpoint/actions/export/:name', function (req, res) {

    if (req.query.name)
        return res.status(400).send({error: 'BadRequest', error_message: "name is a Url param"});

    var name =  (req.params.name).toString();


    var query = {name: name};


    exportAuth(query,function(err,exported){
        if(!err)
            res.status(200).send(exported);
        else
            res.status(500).send(err);
    });
});


/**
 * @api {post} /authms/authendpoint/actions/export Export all authorization rules
 * @apiVersion 1.0.0
 * @apiName ExportAllMicroserviceAuthRules
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Returns an export list of all endpoint rules.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */

router.post('/authendpoint/actions/export', jwtMiddle.ensureIsAuthorized, function (req, res) {
//router.get('/authendpoint/actions/export', function (req, res) {

    exportAuth({},function(err,exported){
        if(!err)
            res.status(200).send(exported);
        else
            res.status(500).send(err);
    });
});


function exportAuth(query,exportedClb){

    AuthEP.find(query,function (err, results) {

        if (!err) {
            var exported={};
            async.eachOfSeries(results,function(value,key,callback){
                if(!exported[value.name]) exported[value.name]={};
                var role=exported[value.name][value.URI]||{POST:[],GET:[],PUT:[],DELETE:[]};
                role[value.method]=value.authToken;
                exported[value.name][value.URI]=role;
                callback();
            },function(err){
                exportedClb(null,exported)
            });
        }
        else {
            exportedClb({error: 'internal_error', error_message: 'something blew up, ERROR:' + err},null);
        }
    });
}



/**
 * @api {post} /authms/authendpoint/actions/export/:name Export authorization rules of a given microservice
 * @apiVersion 1.0.0
 * @apiName ExportMicroserviceAuthRules
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Returns an export list of all endpoint rules of a given microservice.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} name Url params containg the name of the microservice
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
//router.get('/:name/authendpoint', jwtMiddle.ensureIsAuthorized, function(req, res) {
router.post('/authendpoint/actions/import/:name', jwtMiddle.ensureIsAuthorized, function (req, res) {
//router.get('/authendpoint/actions/export/:name', function (req, res) {


    //console.log("BODY " + JSON.stringify(req.body));

    if (req.query.name)
        return res.status(400).send({error: 'BadRequest', error_message: "name is a Url param"});

    if (!req.body.authendpoint)
        return res.status(400).send({error: 'BadRequest', error_message: "No file uploaded"});

    var name =  (req.params.name).toString();

    //console.log("name:" + name);

    importAuth(req.body.authendpoint,name,function(err,exported){
        if(!err)
            res.status(200).send(exported);
        else
            res.status(500).send(err);
    });
});


/**
 * @api {post} /authms/authendpoint/actions/export/:name Export authorization rules of a given microservice
 * @apiVersion 1.0.0
 * @apiName ExportMicroserviceAuthRules
 * @apiGroup Authms
 *
 * @apiDescription Accessible only by microservice access tokens. Returns an export list of all endpoint rules of a given microservice.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} name Url params containg the name of the microservice
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
//router.get('/:name/authendpoint', jwtMiddle.ensureIsAuthorized, function(req, res) {
router.post('/authendpoint/actions/import', jwtMiddle.ensureIsAuthorized, function (req, res) {
//router.get('/authendpoint/actions/export/:name', function (req, res) {

    if (!req.body.authendpoint)
        return res.status(400).send({error: 'BadRequest', error_message: "No file uploaded"});

    importAuth(req.body.authendpoint,null,function(err,exported){
        if(!err)
            res.status(200).send(exported);
        else
            res.status(500).send(err);
    });
});


function importAuth(roles,msName,exportedClb){

    async.eachOfSeries(roles,function(value,key,callback){

        //console.log("Key:" + key + " value:"+value+" msname:"+ msName);

        if((!msName) || (key==msName)){
            async.eachOfSeries(value,function(resource,URI,callbackrole){
                async.eachOfSeries(resource,function(autToken,method,callbacktoken){
                    if(autToken.length>0){
                         AuthEP.findOne({URI: URI, method:method}, function (err, item) {
                                if (err) return callbacktoken({error: "InternalError", error_message: "Internal Error " + err});
                                if (item) return callbacktoken();
                                try {

                                    AuthEP.create({URI:URI,method:method,name:key,authToken:autToken},function(err,Nitem){
                                        // console.log("Creatig USER" + err);
                                        console.log(Nitem);
                                        if(!err) return callbacktoken();
                                        else return callbacktoken(err);
                                    });
                                } catch (ex) {
                                    return callbacktoken({
                                            error: "InternalError",
                                            error_message: 'Unable to register microservice Auth Tokens (err:' + ex + ')'
                                         });
                                }
                         });
                    }else
                        callbacktoken();

                },function(err){
                    if(!err) callbackrole();
                    else callbackrole(err);
                });
            },function(err){
                if(!err) callback();
                else callback(err);
            });

        }else
            callback();
    },function(err){
        if(!err)
            exportedClb(null,{result:"import Done"});
        else
            exportedClb(err,null);
    });
}





module.exports = router;