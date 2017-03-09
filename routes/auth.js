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
 * @apiDescription Accessible only by microservice access tokens. Logs in the User and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} username the email
 * @apiParam {String} password the password
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "username": "prov@prova.it" , "password":"provami"}
 *
 * @apiSuccess (200 - OK) {Object} apiKey  information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token  user Token
 * @apiSuccess (200 - OK) {String} apiKey.expires  token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken  information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token  user refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires  refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId  user id
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
 */
router.post('/signin', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body || _.isEmpty(req.body)) {
        return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});
    }

    if (!req.body.username) return res.status(400).send({error: 'BadRequest', error_message: "No username provided"});

    if (!req.body.password) return res.status(400).send({error: 'BadRequest', error_message: "No password provided"});
//    console.log(req);

    //console.log("body:"+util.inspect(req.body));
    passport.authenticate('local', function (err, user, info) {

        //console.log(info);
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
 * @api {post} /authuser/signup Register a new User
 * @apiVersion 1.0.0
 * @apiName Create User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access tokens. Creates a new User object and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} user the User dictionary with all the fields, only email, password and type are mandatory.
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "email": "prova@prova.it" , "password":"provami", "type":"ext", "name":"nome"}
 *
 * @apiSuccess (201 - CREATED) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (201 - CREATED) {String} apiKey.token  user Token
 * @apiSuccess (201 - CREATED) {String} apiKey.expires  token expiration date
 * @apiSuccess (201 - CREATED) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (201 - CREATED) {String} refreshToken.token  user refreshToken
 * @apiSuccess (201 - CREATED) {String} refreshToken.expires  refreshToken expiration date
 * @apiSuccess (201 - CREATED) {String} userId  user id
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


    //user['validated'] = true;
    if (!(conf.getParam("userType").indexOf(user['type']) >= 0))//||  user['type'] == 'admin'
        return res.status(400).send({error: 'BadRequest', error_message: "No valid User Type provided"});


    // try {
    //     User.register(user, password, function (err, newuser) {
    //         // console.log("Creatig USER" + err);
    //         if (err) return res.status(500).send({
    //             error: "signup_error",
    //             error_message: 'Unable to register user (err:' + err + ')'
    //         });
    //
    //         return res.status(201).send(commonfunctions.generateToken(newuser, "user"));
    //     });
    // }catch (ex){
    //     //console.log("ECCCEPTIO "+ ex);
    //     return res.status(500).send({
    //         error: "signup_error",
    //         error_message: 'Unable to register user (err:' + ex + ')'
    //     });
    // }

    commonfunctions.createUser(user, password, function (err, scode, respo) {
        return res.status(scode).send(respo);
    });
});


/**
 * @api {get} /authuser Get all Applications in authMs
 * @apiVersion 1.0.0
 * @apiName Get User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access tokens. Returns the paginated list of all Users.
 * Set the pagination skip and limit in the URL request, e.g. "get /authuser?skip=10&limit=50"
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
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
    for (var key in req.query) {
        if (User.schema.path(key))
            query[key] = req.query[key];
    }

    console.log("QUERY:" + util.inspect(query));

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
 * @api {get} /authuser/:id Get the User in AuthMs by id
 * @apiVersion 1.0.0
 * @apiName Get User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access_token. Returns info about Application in AuthMs microservice.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} id the User id
 *
 * @apiSuccess {String} User.id Application id identifier
 * @apiSuccess {String} User.field1 field 1 defined in schema
 * @apiSuccess {String} User.field2 field 2 defined in schema
 * @apiSuccess {String} User.fieldN field N defined in schema
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
 * @api {delete} /authuser/:id delete User in AuthMS
 * @apiVersion 1.0.0
 * @apiName Delete User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access tokens. Deletes the User and returns the deleted resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} id the Application id
 *
 * @apiSuccess (200 - OK) {String} UserField_1 Contains field 1 defined in User Schema (example name)
 * @apiSuccess (200 - OK) {String} UserField_2 Contains field 2 defined in User Schema (example notes)
 * @apiSuccess (200 - OK) {String} UserField_N Contains field N defined in User Schema (example type)
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


//
//router.post('/refreshToken', function(req,res) {
//        "use strict";
//    console.log("REFRESHTOKEN USER");
//        res.status(200).send(generateToken(req.token));
//});


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

    console.log("enbleDisableUser -->" + id);
    User.findByIdAndUpdate(id, {enabled: value}, function (err, updated) {
        if (err) cb(err, null);
        else {
            cb(null, updated);
        }

    });
}
//TODO only webui microservices can call this endopints
//router.post(':id/action/check/',jwtMiddle.ensureIsAuthorized, function(req,res){
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
//router.post(':id/action/uncheck/',jwtMiddle.ensureIsAuthorized, function(req,res){
//        "use strict";
//
//        var id=req.params.id;
//
//        checked_unchecked(id,false,function(err,val){
//            if(err)  res.status(207).send({error: "update_error",error_message: err });
//            else res.status(201).send("ok");
//
//        });
//    }
//);


/**
 * @api {post} /authuser/:id/actions/enable enable User in AuthMs
 * @apiVersion 1.0.0
 * @apiName Enable User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservices access_token. Grants access to the User.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} id the Application id
 *
 * @apiSuccess (200 - OK) {String} status  the new User status
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
 * @api {post} /authuser/:id/actions/disable disable User in AuthMs
 * @apiVersion 1.0.0
 * @apiName Disable User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access tokens. Denies access to the User.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} id the Application id
 *
 * @apiSuccess (200 - OK) {String} status  the new Application status
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
 */
router.post('/:id/actions/disable', jwtMiddle.ensureIsAuthorized, function (req, res) {
        "use strict";

        console.log("DISABLEUSER");
        var id = req.params.id;

        enable_disable(id, false, function (err, val) {
            if (err)  return res.status(207).send({error: "update_error", error_message: err});
            else return res.status(200).send({status: "disabled"});
        });
    }
);


/**
 * @api {post} /authuser/:id/actions/resetpassword Reset User password in AuthMs
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access tokens. Creates a reset password Token.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} id the Application id
 *
 * @apiSuccess (200 - OK) {String} reset_token  the grant token to set the new password
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
 */
router.post('/:id/actions/resetpassword', jwtMiddle.ensureIsAuthorized, function (req, res) {
    "use strict";

    var secret = require('../app').get('jwtTokenSecret');
    var id = req.params.id;

    User.findById(id, function (err, usr) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!usr) return res.status(404).send({error: "NotFound", error_message: "User not Found"});

        var token = jwt.encode({
            id: id,
            hash: usr.hash,
            salt: usr.salt
        }, secret);
        return res.status(200).send({reset_token: token});
    });

});



/**
 * @api {post} /authuser/:id/actions/setpassword Update the User password in AuthMs
 * @apiVersion 1.0.0
 * @apiName SetPassword
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access tokens. Updates the User password.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * if set, the same  token sent in Authorization header should be undefined
 * @apiParam {String} id the User id
 * @apiParam {String} oldpassword the current password to be changed. Overwrites reset_token parameter.
 * @apiParam {String} newpassword the new password
 * @apiParam {String} reset_token a token used to set a new password. It is overwritten by oldpassword parameter
 *
 * @apiSuccess (200 - OK) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token  User Token
 * @apiSuccess (200 - OK) {String} apiKey.expires  token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} refreshToken.token  user refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires  refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId  user id
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


    User.findById(id, function (err, usr) {
        if (err) return res.status(500).send({error: "internal_error", error_message: err});

        if (!usr) return res.status(404).send({error: "NotFound", error_message: "User not Found"});


        if (oldpassword) {
            usr.authenticate(oldpassword, function (erro, auth) {
                if (erro) return res.status(500).send({error: "INTERNAL_ERROR", error_message: erro});

                if (!auth) return res.status(401).send({error: "Forbidden", error_message: "oldpassword is not valid"});
            });
        } else {
            var decoded = jwt.decode(reset_token, require('../app').get('jwtTokenSecret'));
            console.log("Dcoded:" + decoded)
            if (!((usr.hash == decoded.hash) && (usr.salt == decoded.salt)))
                return res.status(401).send({error: "Forbidden", error_message: "reset_token is not valid"});
        }

        usr.setPassword(newpassword, function (err, obj) {
            if (err) return res.status(500).send({error: "internal_error", error_message: err});
            usr.save(function (err, obj) {
                    "use strict";
                    if (err) return res.status(500).send({error: "internal_error", error_message: err});
                    return res.status(200).send(commonfunctions.generateToken(usr, "user"));
                }
            )
        });

    });
});


module.exports = router;