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
 * @apiSuccess (200 - OK) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token  application Token
 * @apiSuccess (200 - OK) {String} apiKey.expires  token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token  application refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires  refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId  application id
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
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {Object} app  The application dictionary with all the fields. Only email, password and type are mandatory.
 * @apiParam (Body parameter) {String} app.email  Application email, valid as username to login
 * @apiParam (Body parameter) {String} app.password Application password
 * @apiParam (Body parameter) {String} app.type Application type. for example external, webUi...
 * @apiParam (Body parameter) {String} [app.name] Application name for example cruiseKiosk,PortWebUI....
 * @apiParam (Body parameter) {String} [app.avatar] Application avatar image  identifier in uploadms
 * @apiParam (Body parameter) {String} [app.notes] Application notes
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "email": "prova@prova.it" , "password":"provami", "type":"ext", "name":"nome"}
 *
 * @apiSuccess (201 - CREATED) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (201 - CREATED) {String} apiKey.token  application Token
 * @apiSuccess (201 - CREATED) {String} apiKey.expires  token expiration date
 * @apiSuccess (201 - CREATED) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (201 - CREATED) {String} refreshToken.token  application refreshToken
 * @apiSuccess (201 - CREATED) {String} refreshToken.expires  refreshToken expiration date
 * @apiSuccess (201 - CREATED) {String} userId  application id
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

    //user['validated'] = true;
    if (!(conf.getParam("appType").indexOf(app['type']) >= 0))//||  user['type'] == 'admin'
        return res.status(400).send({error: 'BadRequest', error_message: "No valid App Type provided"});

    //console.log("############### SIGN UP");
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
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/', jwtMiddle.ensureIsAuthorized, function (req, res) {

    //TODO: returns ALL users, must be changed to return only authorized users
    //given an authenticated user (by token)

    //console.log(req);

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
 * @apiParam (URL parameter) {String} id the Application id
 *
 * @apiSuccess {String} Application.id Application identifier
 * @apiSuccess {String} Application.field1 field 1 defined in schema
 * @apiSuccess {String} Application.field2 field 2 defined in schema
 * @apiSuccess {String} Application.fieldN field N defined in schema
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
 * @apiParam (URL parameter) {String} id The Application id
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


function checked_unchecked(id, value, cb) {

    App.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }
    });

}

function enable_disable(id, value, cb) {

    console.log("enbleDisableApp-->" + id);

    App.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }
    });

}


//TODO only webui microservices can call this endopints
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
 * @apiParam (URL parameter) {String} id The Application id
 *
 * @apiSuccess (200 - OK) {String} status contains the new Application status
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
 * @apiParam (URL parameter) {String} id The Application id
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

        console.log("Disable");

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
 * @apiParam (URL parameter) {String} id The Application id
 *
 * @apiSuccess (200 - OK) {String} reset_token the grant token to set the new password
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

    App.findById(id, function (err, usr) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!usr) return res.status(404).send({error: "NotFound", error_message: "App not Found"});

        var token = jwt.encode({
            id: id,
            hash: usr.hash,
            salt: usr.salt
        }, secret);
        return res.status(200).send({reset_token: token});
    });

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
 * @apiParam (URL parameter) {String} id The Application id
 * @apiParam (Body parameter) {String} [oldpassword] The old password to update. If set, reset_token must be undefined
 * @apiParam (Body parameter) {String} newpassword The new password
 * @apiParam (Body parameter) {String} [reset_token] Token used to update the password. If set, oldpassword must be undefined

 *
 * @apiSuccess (200 - OK) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token  application Token
 * @apiSuccess (200 - OK) {String} apiKey.expires  token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token  application refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires  refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId  application id
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

    App.findById(id, function (err, apl) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!apl) return res.status(404).send({error: "NotFound", error_message: "APP not Found"});

        if (oldpassword) {
            apl.authenticate(oldpassword, function (erro, auth) {
                if (erro) return res.status(500).send({error: "INTERNAL_ERROR", error_message: erro});

                if (!auth) return res.status(401).send({error: "Forbidden", error_message: "oldpassword is not valid"});
            });
        } else {
            var decoded = jwt.decode(reset_token, require('../app').get('jwtTokenSecret'));
            console.log("Dcoded:" + decoded)
            if (!((apl.hash == decoded.hash) && (apl.salt == decoded.salt)))
                return res.status(401).send({error: "Forbidden", error_message: "reset_token is not valid"});
        }

        apl.setPassword(newpassword, function (err, obj) {
            if (err) return res.status(500).send({error: "internal_error", error_message: err});
            apl.save(function (err, obj) {
                    "use strict";
                    if (err) return res.status(500).send({error: "internal_error", error_message: err});
                    return res.status(200).send(commonfunctions.generateToken(apl, "developer"));
                }
            )
        });
    });

});


module.exports = router;