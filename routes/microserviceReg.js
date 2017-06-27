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

var express = require('express');
var router = express.Router();
var Microservice = require('../models/microservices').Microservice;
var jwtMiddle = require('./jwtauth');
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


// ****************************************************************************************************
// |                                                                                                  |
// |                            Begin of endpoints used only by AuthMs User Interface                 |
// |                                                                                                  |
// ****************************************************************************************************

router.post('/authendpoint/actions/export/:name', jwtMiddle.ensureIsAuthorized, function (req, res) {

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


router.post('/authendpoint/actions/export', jwtMiddle.ensureIsAuthorized, function (req, res) {

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


router.post('/authendpoint/actions/import/:name', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (req.query.name)
        return res.status(400).send({error: 'BadRequest', error_message: "name is a Url param"});

    if (!req.body.authendpoint)
        return res.status(400).send({error: 'BadRequest', error_message: "No file uploaded"});

    var name =  (req.params.name).toString();

    importAuth(req.body.authendpoint,name,function(err,exported){
        if(!err)
            res.status(200).send(exported);
        else
            res.status(500).send(err);
    });
});


router.post('/authendpoint/actions/import', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body.authendpoint)
        return res.status(400).send({error: 'BadRequest', error_message: "No authendpoint field provided"});

    importAuth(req.body.authendpoint,null,function(err,exported){
        if(!err)
            res.status(200).send(exported);
        else
            res.status(500).send(err);
    });
});


function importAuth(roles,msName,exportedClb){

    async.eachOfSeries(roles,function(value,key,callback){

        if((!msName) || (key==msName)){
            AuthEP.remove({name:key},function(err){
                async.eachOfSeries(value,function(resource,URI,callbackrole){
                    async.eachOfSeries(resource,function(autToken,method,callbacktoken){
                        if(autToken.length>0){
                            AuthEP.findOneAndRemove({URI: URI, method:method}, function (err, item) {
                                if (err) return callbacktoken({error: "InternalError", error_message: "Internal Error " + err});

                                try {

                                    AuthEP.create({URI:URI,method:method,name:key,authToken:autToken},function(err,Nitem){
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


router.post('/actions/microservicelist/export', jwtMiddle.ensureIsAuthorized, function (req, res) {

    Microservice.findAll({},null,{},function(err,data){
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

    Microservice.remove({},function(err){
        if(err) {
            errorMsg = errorMsg != null ? errorMsg + "\n\r------------------ \n\r " + err : err;
            return res.status(500).send({error:"InternalError", error_message:"Can not import microservice list due can't delete microservices"});
        }else{
            async.eachSeries(msList,function(microservice,callback){
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
        }
    });



});

router.get('/actions/instances', [jwtMiddle.decodeToken, jwtMiddle.ensureIsAuthorized], function (req, res) {

    var url = conf.getParam("consulUrl") + conf.getParam("consulServices");

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

                for (item in data) {
                    if (respToWebUI.hasOwnProperty([data[item].Service])) {
                        respToWebUI[data[item].Service].instances = respToWebUI[data[item].Service].instances + 1;
                        respToWebUI[data[item].Service].locations.push(data[item].Address + ":" + data[item].Port);
                    }
                }
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
    var url = conf.getParam("consulUrl") + conf.getParam("consulHealth") + "/";

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

                        for (item in data) {
                            ip = data[item].Service.Address + "  |-->  " + data[item].Service.Port;
                            for (check in data[item].Checks) {
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


// ******************************^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^  *******************
// |                             | | | | | | | | | | | | | | | | | | | | | | | | | |                  |
// |                            END of endpoints used only by AuthMs User Interface                   |
// |                                                                                                  |
// ****************************************************************************************************





/**
 * @api {post} /authms/renewtoken Refresh microservice token
 * @apiVersion 1.0.0
 * @apiName Refresh microservice token
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, creates a new acess_token for a given microservice type.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} serviceType The name of the microservice token type
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "serviceType": "userms" }
 *
 * @apiSuccess (201 - OK) {String} token the microservice access_token
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 201 CREATED
 *      {
 *        "token":"9804H4334HFN......"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/renewtoken', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var serviceType = req.body.serviceType;
    if (!serviceType)
        return res.status(400).send({error: "BadRequest", error_message: "no serviceType provided"});

    var tokenV = JSON.parse(commonfunctions.generateMsToken(serviceType)).token;
    Microservice.findOneAndUpdate({name: serviceType}, {token: tokenV}, {new: true}, function (error, ute) {
        if (error || (!ute)) {
            res.status(404).send({error: "NotFound", error_message: error || "No Microservice Type Found"});
        } else {
            res.status(201).send({token: tokenV});
        }
    });

});



/**
 * @api {post} /authms/signup Create a new Microservice
 * @apiVersion 1.0.0
 * @apiName Create a new Microservice
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, creates a new microservice type.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} name     The name of the microservice to create
 * @apiParam (Body parameter) {String} baseUrl  The microservice gateway/loadbalance base url
 * @apiParam (Body parameter) {String} color    The color used in the UI to represent the microservice
 * @apiParam (Body parameter) {String} icon     The icon used in the UI to represent the microservice
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "name": "userms",
 *        "baseUrl":"localhost:3000/nginx",
 *        "color":"yellow",
 *        "icon":"fa-users"
 *       }
 *
 * @apiSuccess (201 - OK) {String}  name    microservice name
 * @apiSuccess (201 - OK) {String}  baseUrl microservice base url
 * @apiSuccess (201 - OK) {String}  color   color in configure interface
 * @apiSuccess (201 - OK) {String}  icon    icon in configure interface
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 201 CREATED
 *      {
 *        "name":"userms",
 *        "baseUrl":"localhost:3000/nginx",
 *        "color":"yellow",
 *        "icon":"fa-users"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
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
            var tokenV = JSON.parse(commonfunctions.generateMsToken(miroserviceName)).token;
            Microservice.create({
                name: miroserviceName,
                baseUrl: baseUrl,
                token:tokenV,
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

/**
 * @api {delete} /authms/:id Delete a microservice
 * @apiVersion 1.0.0
 * @apiName Delete a microservice
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, deletes a microservice.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The microservice id to delete
 *
 * @apiSuccess (200 - OK) {String}  name    microservice name
 * @apiSuccess (200 - OK) {String}  baseUrl microservice base url
 * @apiSuccess (200 - OK) {String}  color   color in configure interface
 * @apiSuccess (200 - OK) {String}  icon    icon in configure interface
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 200 Deleted
 *      {
 *        "name":"userms",
 *        "baseUrl":"localhost:3000/nginx",
 *        "color":"yellow",
 *        "icon":"fa-users"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse NotFound
 * @apiSampleRequest off
 */
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
                        error_message: 'Microservice deleted but authorization roles for this microservice should exixst'
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



/**
 * @api {post} /authms/authendpoint Create a new authorization role
 * @apiVersion 1.0.0
 * @apiName Create a new authorization role
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access tokens, creates a new authorization role and returns it.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {Object} microservice             The microservice role dictionary. URI, authToken and method are mandatory fields.
 * @apiParam (Body parameter) {String} [microservice.name]      The name of the microservice whose access is managed by the role
 * @apiParam (Body parameter) {String} microservice.URI         URI of resource whose access is managed by the role
 * @apiParam (Body parameter) {String[]} microservice.authToken List of token types allowed to access this resource managed by the role
 * @apiParam (Body parameter) {String} microservice.method      HTTP method (GET, POST, PUT, DELETE) that MUST be set to specialize the role
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
 * @apiSuccess (201 - OK) {String}      _id         role identifier
 * @apiSuccess (201 - OK) {String}      URI         URI of the resource
 * @apiSuccess (201 - OK) {String[]}    authToken   list of token types allowed to access the resource
 * @apiSuccess (201 - OK) {String}      method      HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the role
 * @apiSuccess (201 - OK) {String}      [name]      microservice name on which role are set
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
 * @apiSampleRequest off
 */
router.post('/authendpoint', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) return res.status(400).send({
        error: "BadREquest",
        error_message: 'request body missing'
    });
    var microservice = req.body.microservice;

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
 * @api {get} /authms/authendpoint Get all authorization roles
 * @apiVersion 1.0.0
 * @apiName GetAuthroles
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, returns a paginated list of all endpoint roles.<BR>
 * Set pagination skip and limit or other filters in the URL request, e.g. "get /authms/authendpoint?skip=10&limit=50"
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Query parameter) {Number}                                 [skip]      Pagination skip param
 * @apiParam (Query parameter) {Number}                                 [limit]     Pagination limit param
 * @apiParam (Query parameter) {String}                                 [URI]       Filter by URI
 * @apiParam (Query parameter) {String="GET","POST","PUT","DELETE"}     [method]    Filter by method
 * @apiParam (Query parameter) {String}                                 [name]      Filter by the name of the microservice (not recommended, use /authendpoint/:name enpoint instead)
 * @apiParam (Query parameter) {String}                                 [_id]       Filter by the id of the microservice (not recommended, use /authendpoint/:id enpoint instead)
 *
 *
 * @apiUse Metadata
 * @apiUse GetAuthResource
 * @apiUse GetAuthResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/authendpoint', jwtMiddle.ensureIsAuthorized, function (req, res) {

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
 * @api {get} /authms/authendpoint/:name Get authorization roles of a given microservice
 * @apiVersion 1.0.0
 * @apiName GetMicroserviceAuthroles
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, returns the paginated list of all endpoint roles of a given microservice.<BR>
 * Set pagination skip and limit or other filters in the URL request, e.g. "get /authms/authendpoint?skip=10&limit=50"
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter)    {String}                                name        Name of the microservice
 * @apiParam (Query parameter)  {Number}                                [skip]      Pagination skip param
 * @apiParam (Query parameter)  {Number}                                [limit]     Pagination limit param
 * @apiParam (Query parameter)  {String}                                [URI]       Filter by URI
 * @apiParam (Query parameter)  {String="GET","POST","PUT","DELETE"}    [method]    Filter by method
 *
 * @apiUse Metadata
 * @apiUse GetAuthResource
 * @apiUse GetAuthResourceExample
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
 * @api {get} /authms/authendpoint/:id Get authorization role by id
 * @apiVersion 1.0.0
 * @apiName GetAuthrolesById
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, returns an authorization role by id.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    Authorization role id
 *
 * @apiSuccess (200 - OK) {String} _id          role identifier
 * @apiSuccess (200 - OK) {String} [name]       name of the microservice whose access is managed by the role
 * @apiSuccess (200 - OK) {String} URI          URI of resource whose access is managed by the role
 * @apiSuccess (200 - OK) {String} method       HTTP method (GET, POST, PUT, DELETE) that can be set to specialize the role
 * @apiSuccess (200 - OK) {String[]} authToken  list of token types allowed to access the resource
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
 * @api {delete} /authms/authendpoint/:id Delete authorization role by id
 * @apiVersion 1.0.0
 * @apiName DeleteAuthrolesById
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, deletes an authorization role by id.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    Authorization role id
 *
 * @apiSuccess (204 - NO CONTENT) {String}      _id         role identifier
 * @apiSuccess (204 - NO CONTENT) {String}      [name]      name of the microservice whose access is managed by the role
 * @apiSuccess (204 - NO CONTENT) {String}      URI         URI of the resource whose access is managed by the role
 * @apiSuccess (204 - NO CONTENT) {String}      method      HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the role
 * @apiSuccess (204 - NO CONTENT) {String[]}    authToken   list of token types allowed to access the resource
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
 * @apiSampleRequest off
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
 * @api {put} /authms/authendpoint/:id Update authorization role by id
 * @apiVersion 1.0.0
 * @apiName UpdateAuthrolesById
 * @apiGroup Microservice authorisation
 *
 * @apiDescription Protected by access token, updates an authorization role by id.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter)    {String}    id Role identifier
 * @apiParam (Body parameter)   {Object}    microservice                        Role dictionary with updatable fields defined below
 * @apiParam (Body parameter)   {String}    [microservice.URI]                  URI of the resource whose access is managed by the role
 * @apiParam (Body parameter)   {String[]}  [microservice.authToken]            List of token types enabled to access to this resource that are subject of the role.
 * @apiParam (Body parameter)   {String}    [microservice.method]               HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the role
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "microservice": {
 *               "URI":"/users",
 *               "authToken":["WebUI", "UserMS"],
 *               "method":"POST"
 *              }
 *       }
 *
 * @apiSuccess (200 - OK) {String} _id  resource access role id identifier
 * @apiSuccess (200 - OK) {String} name name of microservice which has set the role.
 * @apiSuccess (200 - OK) {String} URI URI of resource on which has set the role.
 * @apiSuccess (200 - OK) {String[]} authToken list of token types allowed to access the resource
 * @apiSuccess (200 - OK) {String} method HTTP method (GET, POST, PUT, DELETE) that could have been set to specialize the role
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
 * @apiSampleRequest off
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


module.exports = router;