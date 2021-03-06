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
var User = require('../models/users').User;
var _ = require('underscore')._;
var Passport = require('passport').Passport;
var passport = new Passport();
var jwtMiddle = require('./jwtauth');
var util = require('util');
var commonfunctions = require('./commonfunctions');
var jwt = require('jwt-simple');
var conf = require('../routes/configSettingManagment');
var LocalStrategy = require('passport-local').Strategy;
var middlewares = require('./middlewares');
var async=require("async");
var passwordHash = require('password-hash');

router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);
router.use(passport.initialize());

passport.use(new LocalStrategy(User.authenticate()));


/**
 * @api {post} /authuser/signin User login
 * @apiVersion 1.0.0
 * @apiName Login User
 * @apiGroup User
 *
 * @apiDescription Protected by access token, signs in the User and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} username User email
 * @apiParam (Body parameter) {String} password User password
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "username": "prov@prova.it" , "password":"provami"}
 *
 * @apiSuccess (200 - OK) {Object} apiKey               information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token         user Token
 * @apiSuccess (200 - OK) {String} apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken         information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token   user refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId               user id
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
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
 * @apiUse ServerError
 * @apiUse InvalidUserAndPassword
 * @apiSampleRequest off
 */
router.post('/signin', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) {
        return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});
    }

    if (!req.body.username) return res.status(400).send({error: 'BadRequest', error_message: "No username provided"});

    if (!req.body.password) return res.status(400).send({error: 'BadRequest', error_message: "No password provided"});
    passport.authenticate('local', function (err, user, info) {


        if (err || !user) {
            return res.status(403).send({
                error: 'authentication error',
                error_message: 'You are not correctly authenticated, ' + info.message
            });
        }

        return res.status(200).send(commonfunctions.generateToken(user, "user"));
    })(req, res);

});


/**
 * @api {post} /authuser/signup Sign up a new User
 * @apiVersion 1.0.0
 * @apiName SignUp User
 * @apiGroup User
 *
 * @apiDescription Protected by access token, creates a new User and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {Object} user                 User dictionary with all the fields, only email, password and type are mandatory.
 * @apiParam (Body parameter) {String} user.email           User email valid as username to login
 * @apiParam (Body parameter) {String} user.password        User password
 * @apiParam (Body Parameter) {String} user.type            User type, i.e. admin, cruiser...
 * @apiParam (Body Parameter) {String} [user.name]          User name
 * @apiParam (Body Parameter) {String} [user.surname]       User surname
 * @apiParam (Body Parameter) {String} [application.avatar] User avatar image id in upload service
 * @apiParam (Body Parameter) {String} [application.notes]  User notes
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "email": "prova@prova.it" , "password":"provami", "type":"ext", "name":"nome"}
 *
 * @apiSuccess (201 - CREATED) {Object} apiKey                  information about apiKey token
 * @apiSuccess (201 - CREATED) {String} apiKey.token            user Token
 * @apiSuccess (201 - CREATED) {String} apiKey.expires          token expiration date
 * @apiSuccess (201 - CREATED) {Object} refreshToken            information about refreshToken used to renew token
 * @apiSuccess (201 - CREATED) {String} refreshToken.token      user refreshToken
 * @apiSuccess (201 - CREATED) {String} refreshToken.expires    refreshToken expiration date
 * @apiSuccess (201 - CREATED) {String} userId                  user id
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
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
    var user = req.body.user;

    if (!user) return res.status(400).send({error: 'BadRequest', error_message: "No user provided"});
    if (!user.email) return res.status(400).send({error: 'BadRequest', error_message: "No email username provided"});
    if (!user.type) return res.status(400).send({error: 'BadRequest', error_message: "No type provided"});


    var password = user.password;
    if (!password) return res.status(400).send({error: 'BadREquest', error_message: "No password provided"});
    delete user['password'];

    if (user.access_token)
        delete user['access_token'];

    commonfunctions.getUsers(function(err,usrJson){
        var userType=usrJson.userType;
        //user['validated'] = true;
        if (!(userType.indexOf(user['type']) >= 0))//||  user['type'] == 'admin'
            return res.status(400).send({error: 'BadRequest', error_message: "No valid User Type provided"});

        commonfunctions.createUser(user, password, function (err, scode, respo) {
            return res.status(scode).send(respo);
        });
    });
});


/**
 * @api {get} /authuser Get all Users
 * @apiVersion 1.0.0
 * @apiName Get Users
 * @apiGroup User
 *
 * @apiDescription Protected by access tokens, returns a paginated list of all Users.<BR>
 * Set pagination skip and limit and other filters in the URL request, e.g. "get /authuser?skip=10&limit=50&name=Mario"
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
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.get('/', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var fields = req.dbQueryFields;
    if (!fields)
        fields = '-hash -salt -__v';

    var query = {};
    for (var key in req.query) {
        if (User.schema.path(key))
            query[key] = req.query[key];
    }


    User.findAll(query, fields, req.dbPagination, function (err, results) {

        if (!err) {

            if (!_.isEmpty(results.users))
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
 * @api {get} /authuser/:id Get User by id
 * @apiVersion 1.0.0
 * @apiName Get User
 * @apiGroup User
 *
 * @apiDescription Protected by access token, returns user dictionary.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The User id
 *
 * @apiSuccess {String} User.id         Application id identifier
 * @apiSuccess {String} User.field1     field 1 defined in schema
 * @apiSuccess {String} User.field2     field 2 defined in schema
 * @apiSuccess {String} User.fieldN     field N defined in schema
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *        "_id": "543fdd60579e1281b8f6da92",
 *        "email": "prova@prova.it",
 *        "name": "prova",
 *        "notes": "Notes About prova"
 *     }
 *
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

    User.findById(id, fields, function (err, content) {
        if (err) return res.status(404).send({
            error: "GET ERROR",
            error_message: 'Unable to read user (err:' + err + ')'
        });

        if (content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error: "Not found", error_message: "Resource not found with this Id"});
    });

});


/**
 * @api {delete} /authuser/:id Delete User
 * @apiVersion 1.0.0
 * @apiName Delete User
 * @apiGroup User
 *
 * @apiDescription Protected by access tokens, deletes the User and returns the deleted resource.
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
 * @apiSuccess (200 - OK) {String} UserField_1      field 1 defined in User Schema
 * @apiSuccess (200 - OK) {String} UserField_2      field 2 defined in User Schema
 * @apiSuccess (200 - OK) {String} UserField_N      field N defined in User Schema
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 - OK
 *      {
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
router.delete('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    User.findByIdAndRemove(id, function (err, content) {
        if (err) return res.status(404).send({
            error: "delete_error",
            error_message: 'Unable to delete user (err:' + err + ')'
        });
        if (content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error: "Not found", error_message: "Resource not found with this Id"});
    });

});


//checked
function checked_unchecked(id, value, cb) {

    User.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }
    });

}


function enable_disable(id, value, cb) {

    User.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }

    });
}


/**
 * @api {post} /authuser/:id/actions/setusertype/:type Set or update User type
 * @apiVersion 1.0.0
 * @apiName set or update User type
 * @apiGroup User
 *
 * @apiDescription Protected by access token, set or update User type.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    The User id
 * @apiParam (URL parameter) {String} type  The User type to set
 *
 * @apiSuccess (200 - OK) {String} User.id   The User id
 * @apiSuccess (200 - OK) {String} User.tye   The new User type
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
router.post('/:id/actions/setusertype/:type', jwtMiddle.ensureIsAuthorized, function (req, res) {
        "use strict";

        var id = req.params.id;
        var userType=req.params.type;

        //user['validated'] = true;
    commonfunctions.getUsers(function(err,usrJson){
        var allUserType=usrJson.userType;
        if (!(allUserType.indexOf(userType) >= 0))//||  user['type'] == 'admin'
            return res.status(400).send({error: 'BadRequest', error_message: "No valid User Type provided"});
        else{
            User.findByIdAndUpdate(id,{type:userType},function (err,doc) {
                if(err)
                    return res.status(500).send({error: 'InternelError', error_message: err});
                else{
                    return res.status(200).send({id:id, type:userType});
                }
            });
        }
    });

});




/**
 * @api {post} /authuser/:id/actions/enable Enable User
 * @apiVersion 1.0.0
 * @apiName Enable User
 * @apiGroup User
 *
 * @apiDescription Protected by access token, enables the User.
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
 * @apiSuccess (200 - OK) {String} status   The new User status
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
 * @api {post} /authuser/:id/actions/disable Disable User
 * @apiVersion 1.0.0
 * @apiName Disable User
 * @apiGroup User
 *
 * @apiDescription Protected by access token, disables the User.
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
 * @apiSuccess (200 - OK) {String} status   The new User status
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
 * @api {post} /authuser/:id/actions/resetpassword Reset User password
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup User
 *
 * @apiDescription Protected by access tokens, resets user password
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id        The User id
 *
 * @apiSuccess (200 - OK) {String} reset_token  The reset token to set the new password
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "reset_token":"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/resetpassword', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var secret = require('../app').get('jwtTokenSecret');
    var id = req.params.id;

    try{
        User.findById(id,'+hash +salt', function (err, usr) {
            if (err) return res.status(500).send({error: "internal_error", error_message: err});

            if (!usr) return res.status(404).send({error: "NotFound", error_message: "User not Found"});

            if(usr.hash && usr.salt) {

                var content={
                    id: id,
                    privateKey:{
                      h:passwordHash.generate(usr.hash),
                      s:passwordHash.generate(usr.salt)
                    },
                    etag_g:new Date()
                };

                var token = jwt.encode(content, secret);
                return res.status(200).send({reset_token: token});
            }else{
                return res.status(500).send({error: "internal_error", error_message: "Can not compare user credential with reset_token due to no User hash and salt"});
            }
        });
    }catch (ex){
        return res.status(500).send({error: "internal_error", error_message: "Can not compare user credential with reset_token due to  db error " + ex});
    }

});



/**
 * @api {post} /authuser/:id/actions/setpassword Update the User password
 * @apiVersion 1.0.0
 * @apiName SetPassword
 * @apiGroup User
 *
 * @apiDescription Accessible only by access tokens, updates the User password.
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
 * @apiParam (Body Parameter)   {String} [oldpassword]  The old password to update. If set, reset_token must be undefined
 * @apiParam (Body Parameter)   {String} newpassword    The new password
 * @apiParam (Body Parameter)   {String} [reset_token]  Token used to update the password. If set, oldpassword must be undefined
 *
 *
 * @apiSuccess (200 - OK) {Object} apiKey               information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token         User Token
 * @apiSuccess (200 - OK) {String} apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken         information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token   user refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId               user id
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


    User.findById(id,"+hash +salt", function (err, usr) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!usr) return res.status(404).send({error: "NotFound", error_message: "User not Found"});


        async.series([
                function(callback) {
                    if (oldpassword) {
                        usr.authenticate(oldpassword, function (erro, auth) {
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
                        if (!((usr._id==decoded.id) && (passwordHash.verify(usr.hash, decoded.privateKey.h)) && (passwordHash.verify(usr.salt, decoded.privateKey.s))))
                            callback({status:401,error: "Forbidden", error_message: "You are not authorised to reset password"});
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
                    usr.setPassword(newpassword, function (err, obj) {
                        if (err) return res.status(500).send({error: "internal_error", error_message: err});
                        usr.save(function (err, obj) {
                                "use strict";
                                if (err) return res.status(500).send({error: "internal_error", error_message: err});
                                return res.status(200).send(commonfunctions.generateToken(usr, "user"));
                            }
                        )
                    });
                }

            });
    });
});





/**
 * @api {post} /authuser/:id/actions/setusername Update the User username
 * @apiVersion 1.0.0
 * @apiName SetUsername
 * @apiGroup User
 *
 * @apiDescription Accessible only by access tokens, updates the User username.
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
 * @apiSuccess (200 - OK) {String} token.apiKey.token         User Token
 * @apiSuccess (200 - OK) {String} token.apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} token.refreshToken         information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} token.refreshToken.token   user refreshToken
 * @apiSuccess (200 - OK) {String} token.refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} token.userId               user id
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

    User.findByIdAndUpdate(id,{email:newusername}, function (err, usr) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!usr) return res.status(404).send({error: "NotFound", error_message: "User not Found"});

        var resp={
            username:{
                old:usr.email,
                new:newusername
            }
        };
        usr.email=newusername;
        resp.token=commonfunctions.generateToken(usr, "user");

        return res.status(200).send(resp);
    });
});



/**
 * @api {post} /authuser/actions/ids/find Get all Users in a array list
 * @apiVersion 1.0.0
 * @apiName Get User in array list
 * @apiGroup User
 *
 * @apiDescription Protected by access tokens, returns a paginated list of all Users in array list.<BR>
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body Parameter)   {Array} ids  An array of users _id
 * @apiParam (Body Parameter)   {Array} fields An array string of fields to extract
 *
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "ids": ['User1_Id','User2_Is'] , "fields":["name","surname","Type"]}
 *
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
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

        // var query = {_id: {$in: ["57f25faadbf597310fd4a451","5a798d066ba1840ade8cddda"]}};

        User.findAll(query, fields,{skip:-1, limit:-1},function (err, results) {
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