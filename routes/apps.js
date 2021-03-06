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
var App = require('../models/apps').Apps;
var _ = require('underscore')._;
var Passport = require('passport').Passport;
var passport = new Passport();
var LocalStrategy = require('passport-local').Strategy;
var jwtMiddle = require('./jwtauth');
var util=require('util');
var commonfunctions=require('./commonfunctions');
var jwt = require('jwt-simple');
var middlewares=require('./middlewares');
var conf=require('../routes/configSettingManagment');
var async=require("async");
var passwordHash = require('password-hash');

router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);
router.use(passport.initialize());
passport.use(new LocalStrategy(App.authenticate()));


/**
 * @api {post} /authapp/signin Application login
 * @apiVersion 1.0.0
 * @apiName Login Application
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, signs in an application and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} username The email
 * @apiParam (Body parameter) {String} password The password
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "username": "prov@prova.it" , "password":"provami"}
 *
 * @apiSuccess (200 - OK) {Object} apiKey               information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token         application Token
 * @apiSuccess (200 - OK) {String} apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken         information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token   application refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId               application id
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *        },
 *        "refreshToken":{
 *                  "token":"eQO7de4AJe-syk",
 *                  "expires":1467394099074
 *        },
 *       "userId":"4334f423432"
 *    }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse InvalidUserAndPassword
 * @apiSampleRequest off
 */
router.post('/signin', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) {
        return res.status(400).send({error: "BadRequest", error_message: 'request body missing'});
    }

    if (!req.body.username) return res.status(400).send({error: 'BadRequest', error_message: "No username provided"});

    if (!req.body.password) return res.status(400).send({error: 'BadRequest', error_message: "No password provided"});

    passport.authenticate('local', function (err, app, info) {

        if (err || !app) {
            return res.status(403).send({
                error: 'authentication error',
                error_message: 'You are not correctly authenticated, ' + info.message
            });
        }

        //if (app.type != "admin" && !app.validated) {return res.status(403).send( { error: 'app not validated', error_message:'The app is not yet validated by the admins or by mail' }); }

        return res.status(200).send(commonfunctions.generateToken(app, "developer"));
    })(req, res);

});



/**
 * @api {post} /authapp/signup Create a new Application
 * @apiVersion 1.0.0
 * @apiName Create Application
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, creates a new Application object and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {Object} app          The application dictionary with all the fields. Only email, password and type are mandatory.
 * @apiParam (Body parameter) {String} app.email    Application email, valid as username to login
 * @apiParam (Body parameter) {String} app.password Application password
 * @apiParam (Body parameter) {String} app.type     Application type. for example external, webUi...
 * @apiParam (Body parameter) {String} [app.name]   Application name for example cruiseKiosk,PortWebUI....
 * @apiParam (Body parameter) {String} [app.avatar] Application avatar image  identifier in uploadms
 * @apiParam (Body parameter) {String} [app.notes]  Application notes
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "email": "prova@prova.it" , "password":"provami", "type":"ext", "name":"nome"}
 *
 * @apiSuccess (201 - CREATED) {Object} apiKey                  information about apiKey token
 * @apiSuccess (201 - CREATED) {String} apiKey.token            application Token
 * @apiSuccess (201 - CREATED) {String} apiKey.expires          token expiration date
 * @apiSuccess (201 - CREATED) {Object} refreshToken            information about refreshToken used to renew token
 * @apiSuccess (201 - CREATED) {String} refreshToken.token      application refreshToken
 * @apiSuccess (201 - CREATED) {String} refreshToken.expires    refreshToken expiration date
 * @apiSuccess (201 - CREATED) {String} userId                  application id
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *      {
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *        },
 *        "refreshToken":{
*                   "token":"eQO7de4AJe-syk",
 *                   "expires":1467394099074
 *        },
 *       "userId":"4334f423432"
 *    }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse InvalidUserAndPassword
 * @apiSampleRequest off
 */
router.post('/signup', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) return res.status(400).send({
        error: "BadREquest",
        error_message: 'request body missing'
    });
    var app = req.body.app;

    if (!app) return res.status(400).send({error: 'BadRequest', error_message: "No app provided"});

    if (!app.email) return res.status(400).send({error: 'BadRequest', error_message: "No email username provided"});
    if (!app.type) return res.status(400).send({error: 'BadRequest', error_message: "No type provided"});

    var password = app.password;
    if (!password) return res.status(400).send({error: 'BadREquest', error_message: "No password provided"});
    delete app['password'];

    if (app.access_token)
        delete app['access_token'];

    commonfunctions.getApp(function(err,appJson){
        var appType=appJson.appType;
        //user['validated'] = true;
        if (!(appType.indexOf(app['type']) >= 0))//||  user['type'] == 'admin'
            return res.status(400).send({error: 'BadRequest', error_message: "No valid App Type provided"});

        try {
            App.register(app, password, function (err, newpp) {
                if (err) return res.status(500).send({
                    error: "signup_error",
                    error_message: 'Unable to register app (err:' + err + ')'
                });

                return res.status(201).send(commonfunctions.generateToken(newpp, "developer"));
            });
        } catch (ex) {
            return res.status(500).send({error: "signup_error", error_message: 'Unable to register app (err:' + ex + ')'});
        }
    });
});



/**
 * @api {get} /authapp/ Get all Applications
 * @apiVersion 1.0.0
 * @apiName Get Applications
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, returns a paginated list of all Applications.
 * It sets pagination skip, limit and other filters in the URL request, e.g. "get /authapp?skip=10&limit=50&name=Mario"
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 *
 * @apiUse Metadata
 * @apiUse GetAppResource
 * @apiUse GetAppResourceExample
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/', jwtMiddle.ensureIsAuthorized, function (req, res) {


    var fields = req.dbQueryFields;
    if (!fields)
        fields = '-hash -salt -__v';

    var query = {};


    for (var v in req.query)
        if (App.schema.path(v))
            query[v] = req.query[v];

    App.findAll(query, fields, req.dbPagination, function (err, results) {

        if (!err) {

            if (!_.isEmpty(results.apps))
                return res.status(200).send(results);
            else
                return res.status(404).send({error: "Not found", error_message: "Resource not found"});
        }
        else {
            return res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });

});



/**
 * @api {get} /authapp/:id Get Application by id
 * @apiVersion 1.0.0
 * @apiName GetApplication
 * @apiGroup Application
 *
 * @apiDescription Protected by access tokens, returns the application dictionary.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The Application id
 *
 * @apiSuccess {String} Application.id      Application identifier
 * @apiSuccess {String} Application.field1  field 1 defined in schema
 * @apiSuccess {String} Application.field2  field 2 defined in schema
 * @apiSuccess {String} Application.fieldN  field N defined in schema
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *        "_id": "543fdd60579e1281b8f6da92",
 *        "email": "prova@prova.it",
 *        "name": "prova",
 *        "notes": "Notes About prova"
 *     }
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    var fields = req.dbQueryFields;
    if (!fields)
        fields = '-hash -salt -__v';

    App.findById(id, fields, function (err, content) {
        if (err) return res.status(404).send({
            error: "GET ERROR",
            error_message: 'Unable to read user (err:' + err + ')'
        });

        if (content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error: "Not found", error_message: "Resource not found"});
    });

});



/**
 * @api {delete} /authapp/:id Delete Application
 * @apiVersion 1.0.0
 * @apiName Delete Application
 * @apiGroup Application
 *
 * @apiDescription Accessible only by access tokens, delete the Application and returns the deleted resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The Application id
 *
 * @apiSuccess (200 - OK) {String} [ApplicationField_1]  field 1 defined in Application Schema (e.g. name)
 * @apiSuccess (200 - OK) {String} [ApplicationField_2]  field 2 defined in Application Schema (e.g. notes)
 * @apiSuccess (200 - OK) {String} [ApplicationField_N]  field N defined in Application Schema (e.g. type)
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *     {
 *        "name":"Micio",
 *        "notes":"Macio",
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.delete('/:id',jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    App.findByIdAndRemove(id,function(err,content){
        if(err) return res.status(404).send({error: "delete_error",error_message: 'Unable to delete user (err:' + err + ')'});

        if(content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error:"Not found", error_message:"Resource not found with this Id"});
    });

});




/**
 * @api {post} /authuser/:id/actions/setapptype/:type Set or update Application type
 * @apiVersion 1.0.0
 * @apiName set or update Application type
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, set or update Application type.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The Application id
 * @apiParam (URL parameter) {String} type  The Application type to set
 *
 * @apiSuccess (200 - OK) {String} User.id   The Application id
 * @apiSuccess (200 - OK) {String} User.tye   The new Application type
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "id":"02550564065",
 *        "type":"admin"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/setapptype/:type', jwtMiddle.ensureIsAuthorized, function (req, res) {
        "use strict";

        var id = req.params.id;
        var userType=req.params.type;

    commonfunctions.getApp(function(err,appJson){
        var appType=appJson.appType;
        //user['validated'] = true;
        if (!(appType.indexOf(userType) >= 0))//||  user['type'] == 'admin'
            return res.status(400).send({error: 'BadRequest', error_message: "No valid Application Type provided"});
        else{
            App.findByIdAndUpdate(id,{type:userType},function (err,doc) {
                if(err)
                    return res.status(500).send({error: 'InternelError', error_message: err});
                else{
                    return res.status(200).send({id:id, type:userType});
                }
            });
        }
    });

});


function checked_unchecked(id, value, cb) {

    App.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }
    });

}

function enable_disable(id, value, cb) {

    App.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }
    });

}



//router.post(':id/action/check/',jwtMiddle.ensureIsMicroservice, function(req,res){
//        "use strict";
//
//        var id=req.params.id;
//
//        checked_unchecked(id,true,function(err,val){
//            if(err)  res.status(207).send({error: "update_error",error_message: err });
//            else res.status(201).send("ok");
//
//        });
//    }
//);
//router.post(':id/action/uncheck/',jwtMiddle.ensureIsMicroservice, function(req,res){
//        "use strict";
//
//        var id=req.params.id;
//
//        checked_unchecked(id,false,function(err,val){
//           if(err)  res.status(207).send({error: "update_error",error_message: err });
//           else res.status(201).send("ok");
//
//        });
//    }
//);



/**
 * @api {post} /authapp/:id/actions/enable Enable Application
 * @apiVersion 1.0.0
 * @apiName EnableApplication
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, enables the Application.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The Application id
 *
 * @apiSuccess (200 - OK) {String} status  the new Application status
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "status":"enabled"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/enable', jwtMiddle.ensureIsAuthorized, function (req, res) {
        "use strict";

        var id = req.params.id;

        enable_disable(id, true, function (err, val) {
            if (err)  return res.status(207).send({error: "update_error", error_message: err});
            else return res.status(200).send({status: "enabled"});
        });
    }

);


/**
 * @api {post} /authapp/:id/actions/disable Disable Application
 * @apiVersion 1.0.0
 * @apiName DisableApplication
 * @apiGroup Application
 *
 * @apiDescription Protected by microservice access token, disables the Application.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The Application id
 *
 * @apiSuccess (200 - OK) {String} status  the new Application status
 *
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "status":"disabled"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 *
 */
router.post('/:id/actions/disable', jwtMiddle.ensureIsAuthorized, function (req, res) {
        "use strict";

        var id = req.params.id;

        enable_disable(id, false, function (err, val) {
            if (err)  return res.status(207).send({error: "update_error", error_message: err});
            else return res.status(200).send({status: "disabled"});
        });
    }
);



/**
 * @api {post} /authapp/:id/actions/resetpassword Reset Application password
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, creates a reset password token.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The Application id
 *
 * @apiSuccess (200 - OK) {String} reset_token  the grant token to set the new password
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "reset_token":"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6", *
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/resetpassword', jwtMiddle.ensureIsAuthorized, function (req, res) {
    "use strict";

    var secret = require('../app').get('jwtTokenSecret');
    var id = req.params.id;


    try {
        App.findById(id, '+hash +salt', function (err, apl) {
            if (err) return res.status(500).send({error: "internal_error", error_message: err});

            if (!apl) return res.status(404).send({error: "NotFound", error_message: "App not Found"});


            if (apl.hash && apl.salt) {

                var content = {
                    id: id,
                    privateKey: {
                        h: passwordHash.generate(apl.hash),
                        s: passwordHash.generate(apl.salt)
                    },
                    etag_g: new Date()
                };

                var token = jwt.encode(content, secret);
                return res.status(200).send({reset_token: token});
            } else {
                return res.status(500).send({
                    error: "internal_error",
                    error_message: "Can not compare App credential with reset_token due to no App hash and salt"
                });
            }
        });
    }catch (ex){
        return res.status(500).send({error: "internal_error", error_message: "Can not compare App credential with reset_token due to db error " + ex});
    }

});

/**
 * @api {post} /authapp/:id/actions/setpassword Set new Application password
 * @apiVersion 1.0.0
 * @apiName SetPassword
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, updates the Application password.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter)    {String} id             The Application id
 * @apiParam (Body parameter)   {String} [oldpassword]  The old password to update. If set, reset_token must be undefined
 * @apiParam (Body parameter)   {String} newpassword    The new password
 * @apiParam (Body parameter)   {String} [reset_token]  Token used to update the password. If set, oldpassword must be undefined

 *
 * @apiSuccess (200 - OK) {Object} apiKey               information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token         application Token
 * @apiSuccess (200 - OK) {String} apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken         information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token   application refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId               application id
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *        },
 *        "refreshToken":{
 *                  "token":"eQO7de4AJe-syk",
 *                  "expires":1467394099074
 *        },
 *       "userId":"4334f423432"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse InvalidUserAndPassword
 * @apiSampleRequest off
 */
router.post('/:id/actions/setpassword', jwtMiddle.ensureIsAuthorized, function (req, res) {
    "use strict";

    var id = req.params.id;

    if (!req.body) return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});

    var oldpassword = req.body.oldpassword || null;
    var newpassword = req.body.newpassword || null;
    var reset_token = req.body.reset_token || null;

    if (!oldpassword && !reset_token) {
        return res.status(400).send({error: 'BadRequest', error_message: "No oldpassword o reset_token provided"});
    }
    if (!newpassword) return res.status(400).send({error: 'BadREquest', error_message: "No newpassword provided"});

    App.findById(id,"+hash +salt", function (err, apl) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!apl) return res.status(404).send({error: "NotFound", error_message: "APP not Found"});




        async.series([
                function(callback) {
                    if (oldpassword) {
                        apl.authenticate(oldpassword, function (erro, auth) {
                            if (erro){
                                callback({status:500, error: "INTERNAL_ERROR", error_message: erro},null);
                            }else{
                                if (!auth) {
                                    return callback({
                                        status: 401,
                                        error: "Forbidden",
                                        error_message: "oldpassword is not valid"
                                    }, null);
                                }else{
                                    callback(null, 'one');
                                }
                            }

                        });
                    } else {
                        var decoded = jwt.decode(reset_token, require('../app').get('jwtTokenSecret'));
                        if (!((apl._id==decoded.id) && (passwordHash.verify(apl.hash, decoded.privateKey.h)) && (passwordHash.verify(apl.salt, decoded.privateKey.s))))
                            callback({status:401,error: "Forbidden", error_message: "You are not autorised to reset password"});
                        else
                            callback(null, 'one');
                    }
                }
            ],
            // optional callback
            function(clbErr, results) {
                if(clbErr){
                    return res.status(clbErr.status).send({error: clbErr.error, error_message: clbErr.error_message});
                }else{
                    apl.setPassword(newpassword, function (err, obj) {
                        if (err) return res.status(500).send({error: "internal_error", error_message: err});
                        apl.save(function (err, obj) {
                                "use strict";
                                if (err) return res.status(500).send({error: "internal_error", error_message: err});
                                return res.status(200).send(commonfunctions.generateToken(apl, "developer"));
                            }
                        )
                    });
                }

            }
        );

    });

});


/**
 * @api {post} /authapp/:id/actions/setusername Update the Application username
 * @apiVersion 1.0.0
 * @apiName SetUsername
 * @apiGroup Application
 *
 * @apiDescription Accessible only by access tokens, updates the Application username.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter)    {String} id             The User id
 * @apiParam (URL Parameter)   {String} newusername    The new username to set.
 *
 * @apiSuccess (200 - OK) {Object} username             information about new and old username
 * @apiSuccess (200 - OK) {String} username.old         Old username
 * @apiSuccess (200 - OK) {String} username.new         new username
 * @apiSuccess (200 - OK) {Object} token                new access credentials
 * @apiSuccess (200 - OK) {Object} token.apiKey               information about apiKey token
 * @apiSuccess (200 - OK) {String} token.apiKey.token         Application Token
 * @apiSuccess (200 - OK) {String} token.apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} token.refreshToken         information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} token.refreshToken.token   Application refreshToken
 * @apiSuccess (200 - OK) {String} token.refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} token.userId               Application id
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *                 },
 *        "refreshToken":{
 *                          "token":"eQO7de4AJe-syk",
 *                          "expires":1467394099074
 *                       },
 *       "userId":"4334f423432"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse NotFound
 * @apiUse ServerError
 * @apiUse InvalidUserAndPassword
 * @apiSampleRequest off
 *
 */
router.post('/:id/actions/setusername/:newusername', jwtMiddle.ensureIsAuthorized, function (req, res) {
    "use strict";

    var id = req.params.id;
    var newusername = req.params.newusername;

    App.findByIdAndUpdate(id,{email:newusername}, function (err, usr) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!usr) return res.status(404).send({error: "NotFound", error_message: "User not Found"});

        var resp={
            username:{
                old:usr.email,
                new:newusername
            }
        };
        usr.email=newusername;
        resp.token=commonfunctions.generateToken(usr, "developer");

        return res.status(200).send(resp);
    });
});





/**
 * @api {post} /authapp/actions/ids/find Get all Applications in a array list
 * @apiVersion 1.0.0
 * @apiName Get Appliclations in array list
 * @apiGroup Application
 *
 * @apiDescription Protected by access tokens, returns a paginated list of all Applications in array list.<BR>
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body Parameter)   {Array} ids  An array of Application _id
 * @apiParam (Body Parameter)   {Array} fields An array string of fields to extract
 *
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "ids": ['App1_Id','App2_Is'] , "fields":["name","surname","Type"]}


 * @apiUse GetAppResource
 * @apiUse GetAppResourceExample
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */

router.post('/actions/ids/find', jwtMiddle.ensureIsAuthorized, function (req, res) {

try {
    if (!req.body) return res.status(400).send({error: "BadRequest", error_message: "body missing"});
    if (!req.body.ids) return res.status(400).send({
        error: "BadRequest",
        error_message: "mandatory 'ids' body param not found"
    });

    if (req.body.fields && !(Array.isArray(req.body.fields)) ) return res.status(400).send({
        error: "BadRequest",
        error_message: "field param must be an array"
    });



    var fields = req.body.fields;

    if (!fields)
        fields = '-hash -salt -__v';
    else
        fields = fields.join(" ");

    var ids = req.body.ids;

    if (!(Array.isArray(ids)) ) return res.status(400).send({
        error: "BadRequest",
        error_message: "ids param must be an array"
    });

    var query = {_id: {$in: ids}};

    App.findAll(query, fields, {skip:-1, limit:-1}, function (err, results) {

        if (!err) {
                return res.status(200).send(results);
        }
        else {
            return res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });
}catch (ex){
    return res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + ex});
}

});




module.exports = router;