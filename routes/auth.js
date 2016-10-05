var express = require('express');
var router = express.Router();
var User = require('../models/users').User;
var _ = require('underscore')._;

var Passport = require('passport').Passport;
var passport = new Passport();

var jwtMiddle = require('./jwtauth');
var util=require('util');
var commonfunctions=require('./commonfunctions');
var jwt = require('jwt-simple');


var conf=require('../routes/configSettingManagment');

var LocalStrategy = require('passport-local').Strategy;

var middlewares=require('./middlewares');



router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);

router.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));


// Begin Macro
/**
 * @apiDefine  NotFound
 * @apiError 404_NotFound <b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR>
 * <b>request.body.error</b> contains an error name specifing the not Found Error.<BR>
 * <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR>
 */

/**
 * @apiDefine Metadata
 * @apiSuccess {Object} _metadata object containing metadata for pagination information
 * @apiSuccess {Number} _metadata.skip  Skips the first skip results of this Query
 * @apiSuccess {Number} _metadata.limit  Limits the number of results to be returned by this Query.
 * @apiSuccess {Number} _metadata.totalCount Total number of query results.
 */


/**
 * @apiDefine  ServerError
 * @apiError 500_ServerError <b>ServerError:</b>Internal Server Error. <BR>
 * <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR>
 * <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR>
 * @apiErrorExample Error-Response: 500 Internal Server Error
 *     HTTP/1.1 500 Internal Server Error
 *      {
 *         error: 'Internal Error'
 *         error_message: 'something blew up, ERROR: No MongoDb Connection'
 *      }

 */

/**
 * @apiDefine  BadRequest
 * @apiError 400_BadRequest <b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR>
 * <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR>
 * <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR>
 *
 *  @apiErrorExample Error-Response: 400 BadRequest
 *     HTTP/1.1 400 InvalidRequest
 *      {
 *         error:'BadRequest',
 *         error_message:'no body sended',
 *      }
 */



/**
 * @apiDefine  Unauthorized
 * @apiError 401_Unauthorized <strong>Unauthorized:</strong> not authorized to call this endpoint.<BR>
 * <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR>
 * <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR>
 * @apiErrorExample Error-Response: 401 Unauthorized
 *     HTTP/1.1 401 Unauthorized
 *      {
 *         error:"invalid_token",
 *         error_description:"Unauthorized: The access token expired"
 *      }
 */



/**
 * @apiDefine  IvalidUserAanPassword
 * @apiError 403_Unauthorized <strong>Unauthorized:</strong> username or password not valid.<BR>
 * <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR>
 * <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR>
 * @apiErrorExample Error-Response: 403 Unauthorized
 *     HTTP/1.1 403 Unauthorized
 *      {
 *         error:"Unauthorized",
 *         error_description:"Warning: wrong username"
 *      }
 */




/**
 * @apiDefine GetResource
 * @apiSuccess {Object[]} users a paginated array list of users objects
 * @apiSuccess {String} users.id User id identifier
 * @apiSuccess {String} users.field1 field 1 defined in schema
 * @apiSuccess {String} users.field2 field 2 defined in schema
 * @apiSuccess {String} users.fieldN field N defined in schema
 *
 */


/**
 * @apiDefine GetResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *
 *     {
 *       "users":[
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "email": "prova@prova.it",
 *                           "name": "prova",
 *                          "notes": "Notes About prova"
 *                      },
 *                      {
 *                       "id": "543fdd60579e1281sdaf6da92",
 *                          "email": "prova1@prova.it",
 *                          "name": "prova1", *
 *                          "notes": "Notes About prova1"
 *
 *                     },
 *                    ...
 *                 ],
 *
 *       "_metadata":{
 *                   "skip":10,
 *                   "limit":50,
 *                   "totalCount":100
 *               }
 *    }
 */


// End Macro







/**
 * @api {post} /authuser/signin User login in AuthMS
 * @apiVersion 1.0.0
 * @apiName Login User
 * @apiGroup User
 *
 * @apiDescription Accessible only by other microservice access_token. It login User and return the access_credentials.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} username the email
 * @apiParam {String} password the password
 *
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "username": "prov@prova.it" , "password":"provami"}
 *
 * @apiSuccess (201 - Created) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (201 - Created) {String} apiKey.token  contains authapp Token
 * @apiSuccess (201 - Created) {String} apiKey.expires  contains information about token life
 * @apiSuccess (201 - Created) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (201 - Created) {String} refreshToken.token  contains authapp refreshToken
 * @apiSuccess (201 - Created) {String} refreshToken.expires  contains information about refreshToken life
 * @apiSuccess (201 - Created) {String} userId  contains the id of app in authMS
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *        },
 *        "refreshToken":{
 *                  "token":"eQO7de4AJe-syk",
 *                  "expires":1467394099074
 *       },
 *       "userId":"4334f423432"
 *    }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse IvalidUserAanPassword
 *
 */
router.post('/signin',jwtMiddle.ensureIsAuthorized, function (req, res) {



    if(!req.body || _.isEmpty(req.body) ) {
        return res.status(400).send({error:"BadREquest",error_message:'request body missing'});
    }

    if (!req.body.username) return res.status(400).send({error: 'BadRequest', error_message : "No username provided"});


    if (!req.body.password) return res.status(400).send({error: 'BadRequest', error_message : "No password provided"});
//    console.log(req);

    //console.log("body:"+util.inspect(req.body));
    passport.authenticate('local', function(err, user, info) {

        console.log(info);
        if (err || !user) { return res.status(403).send( { error: 'authentication error', error_message:'You are not correctly authenticated, ' + info.message  }); }

        return res.status(201).send(commonfunctions.generateToken(user,"user"));
    })(req,res);
});


/**
 * @api {post} /authuser/signup Register a new User
 * @apiVersion 1.0.0
 * @apiName Create User
 * @apiGroup User
 *
 * @apiDescription Accessible by Microservice access_token. It create a new User object and return the access_credentials.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} user the User dictionary with all the fields, only email, password and type are mandatory.
 *
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "email": "prova@prova.it" , "password":"provami", "type":"ext", "name":"nome"}
 *
 * @apiSuccess (201 - Created) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (201 - Created) {String} apiKey.token  contains authapp Token
 * @apiSuccess (201 - Created) {String} apiKey.expires  contains information about token life
 * @apiSuccess (201 - Created) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (201 - Created) {String} refreshToken.token  contains authapp refreshToken
 * @apiSuccess (201 - Created) {String} refreshToken.expires  contains information about refreshToken life
 * @apiSuccess (201 - Created) {String} userId  contains the id of app in authMS
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *        },
 *        "refreshToken":{
 *                  "token":"eQO7de4AJe-syk",
 *                  "expires":1467394099074
 *       },
 *       "userId":"4334f423432"
 *    }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse IvalidUserAanPassword
 *
 */
router.post('/signup',jwtMiddle.ensureIsAuthorized, function (req, res) {


    if (!req.body || _.isEmpty(req.body) ) return res.status(400).send({error:"BadREquest",error_message:'request body missing'});
    var user = req.body.user;

    if (!user) return res.status(400).send({error: 'BadRequest', error_message : "No user provided"});
    if (!user.email) return res.status(400).send({error: 'BadRequest', error_message : "No email username provided"});
    if (!user.type) return res.status(400).send({error: 'BadRequest', error_message : "No type provided"});


    var password = user.password;
    if (!password) return res.status(400).send({error: 'BadREquest', error_message : "No password provided"});
    delete user['password'];
    
    if(user.access_token)
    delete user['access_token'];


    //user['validated'] = true;
    if(!(conf.getParam("userType").indexOf(user['type'])>=0))//||  user['type'] == 'admin'
       return res.status(400).send({error: 'BadRequest', error_message : "No valid User Type provided"});


    
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

    commonfunctions.createUser(user,password,function(err, scode, respo){
        return res.status(scode).send(respo);
    });
});



/**
 * @api {get} /authuser Get all Applications in authMs
 * @apiVersion 1.0.0
 * @apiName Get User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access_token, it returns the paginated list of all Users.
 * To set pagination skip and limit, you can do it in the URL request, for example "get /authuser?skip=10&limit=50"
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 *
 *
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.get('/', jwtMiddle.ensureIsAuthorized, function(req, res) {

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

    User.findAll(query, fields, req.dbPagination, function(err, results){

        if(!err){

            if (!_.isEmpty(results.users))
                return res.status(200).send(results);
            else
                return res.status(404).send({error:"Not found", error_message:"Resource not found"});
        }
        else{
            return res.status(500).send({error:'internal_error', error_message: 'something blew up, ERROR:'+err  });
        }
    });
});


/**
 * @api {get} /authuser/:id Get the User in AuthMs by id
 * @apiVersion 1.0.0
 * @apiName Get User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access_token, it returns the info about Application in AuthMs microservice.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the User id to identify the User
 *
 * @apiSuccess {String} User.id Application id identifier
 * @apiSuccess {String} User.field1 field 1 defined in schema
 * @apiSuccess {String} User.field2 field 2 defined in schema
 * @apiSuccess {String} User.fieldN field N defined in schema
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *
 *     {
 *
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
router.get('/:id',jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = req.param('id').toString();

    var fields = req.dbQueryFields;
    if (!fields)
        fields = '-hash -salt -__v';

    User.findById(id,fields,function(err,content){
        if(err) return res.status(404).send({error: "GET ERROR",error_message: 'Unable to read user (err:' + err + ')'});

        if(content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error:"Not found", error_message:"Resource not found with this Id"});
    });

});



/**
 * @api {delete} /authuser/:id delete User in AuthMS
 * @apiVersion 1.0.0
 * @apiName Delete User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservice access_token, It delete User and return the deleted resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the User
 *
 *
 *
 * @apiSuccess (200 - OK) {String} UserField_1 Contains field 1 defined in User Schema(example name)
 * @apiSuccess (200 - OK) {String} UserField_2 Contains field 2 defined in User Schema(example notes)
 * @apiSuccess (200 - OK) {String} UserField_N Contains field N defined in User Schema(example type)
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 200 - OK
 *
 *     {
 *        "name":"Micio",
 *        "notes":"Macio",
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.delete('/:id',jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = req.param('id').toString();


    User.findByIdAndRemove(id,function(err,content){
        if(err) return res.status(404).send({error: "delete_error",error_message: 'Unable to delete user (err:' + err + ')'});
        if(content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error:"Not found", error_message:"Resource not found with this Id"});
    });

});




//
//router.post('/refreshToken', function(req,res) {
//        "use strict";
//    console.log("REFRESHTOKEN USER");
//        res.status(200).send(generateToken(req.token));
//});


//checked
function checked_unchecked(id,value,cb){
    User.findByIdAndUpdate(id,{enabled:value},function(err,updated){
        if(err) cb(err,null);
        else{
            cb(null,updated);
        }
    });
}

function enable_disable(id,value,cb){

    console.log("enbleDisableUser -->"+ id);
    User.findByIdAndUpdate(id,{enabled:value},function(err,updated){
        if(err) cb(err,null);
        else{
            cb(null,updated);
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
 * @apiDescription Accessible only by microservices access_token, It enable the User.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the User
 *
 *
 *
 * @apiSuccess (201 - Created) {String} status contains the new User status
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *        "status":"enabled"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.post('/:id/actions/enable',jwtMiddle.ensureIsAuthorized, function(req, res){
        "use strict";

        var id=req.params.id;

        enable_disable(id,true,function(err,val){
            if(err)  return res.status(207).send({error: "update_error",error_message: err });
            else return res.status(201).send({status:"enabled"});
        });
    }
);



/**
 * @api {post} /authuser/:id/actions/disable disable User in AuthMs
 * @apiVersion 1.0.0
 * @apiName Disable User
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservices access_token, It disable the User.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the User
 *
 *
 *
 * @apiSuccess (201 - Created) {String} status  contains the new Application status
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *        "status":"disabled"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.post('/:id/actions/disable',jwtMiddle.ensureIsAuthorized, function(req, res){
        "use strict";

        console.log("DISABLEUSER");
        var id=req.params.id;

        enable_disable(id,false,function(err,val){
            if(err)  return res.status(207).send({error: "update_error",error_message: err });
            else return res.status(201).send({status:"disabled"});
        });
    }
);




/**
 * @api {post} /authuser/:id/actions/resetpassword Reset User password in AuthMs
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservices access_token, It create a reset password Token.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the User
 *
 *
 *
 * @apiSuccess (201 - Created) {String} reset_token Contains grant token to set the new password
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *        "reset_token":"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * 
 */
router.post('/:id/actions/resetpassword',jwtMiddle.ensureIsAuthorized, function(req, res) {
    "use strict";


    var secret = require('../app').get('jwtTokenSecret');
    var id=req.params.id;

    User.findById(id,function(err,usr){
        if(err) return res.status(500).send({error: "internal_error", error_message:err});

        if(!usr) return res.status(404).send({error: "NotFound", error_message:"User not Found"});

        var token = jwt.encode({
            id:id,
            hash: usr.hash,
            salt: usr.salt
        }, secret  );
        return res.status(201).send({reset_token: token});

    });
});




/**
 * @api {post} /authuser/:id/actions/setpassword Set new User password in AuthMs
 * @apiVersion 1.0.0
 * @apiName SetPassword
 * @apiGroup User
 *
 * @apiDescription Accessible only by microservices access_token, It update User password.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application to identify the User
 * @apiParam {String} oldpassword the current password that shoulb be changed. it must be used in alternative to parameter reset_token.
 * oldpassword overwrite reset_token parameter. oldpassword must be used to change password as reset_token to reset the password.
 * @apiParam {String} newpassword the new password that must be set. To set a new password
 * @apiParam {String} reset_token a token used to set a new password. it must be used in alternative to parameter oldpassword.
 * oldpassword overwrite reset_token parameter. oldpassword must be used to change password as reset_token to reset the password
 *
 *
 *
 * @apiSuccess (201 - Created) {Object} apiKey  contains information about apiKey token
 * @apiSuccess (201 - Created) {String} apiKey.token  contains User Token
 * @apiSuccess (201 - Created) {String} apiKey.expires  contains information about token life
 * @apiSuccess (201 - Created) {Object} refreshToken  contains information about refreshToken used to renew token
 * @apiSuccess (201 - Created) {String} refreshToken.token  contains authapp refreshToken
 * @apiSuccess (201 - Created) {String} refreshToken.expires  contains information about refreshToken life
 * @apiSuccess (201 - Created) {String} userId  contains the id of User in authMS
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *        },
 *        "refreshToken":{
 *                  "token":"eQO7de4AJe-syk",
 *                  "expires":1467394099074
 *       },
 *       "userId":"4334f423432"
 *    }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse NotFound
 * @apiUse ServerError
 * @apiUse IvalidUserAanPassword
 *
 */
router.post('/:id/actions/setpassword',jwtMiddle.ensureIsAuthorized, function(req, res) {
    "use strict";



    var id=req.params.id;


    if(!req.body) return res.status(400).send({error:"BadREquest",error_message:'request body missing'});

    var oldpassword = req.body.oldpassword || null;
    var newpassword = req.body.newpassword || null;
    var reset_token=req.body.reset_token || null;

    if (!oldpassword && !reset_token){
        return res.status(400).send({error: 'BadRequest', error_message : "No oldpassword o reset_token provided"});
    }
    if (!newpassword) return res.status(400).send({error: 'BadREquest', error_message : "No newpassword provided"});


    User.findById(id,function(err,usr){
        if(err) return res.status(500).send({error: "internal_error", error_message:err});

        if(!usr) return res.status(404).send({error: "NotFound", error_message:"User not Found"});


        if(oldpassword){
            usr.authenticate(oldpassword,function(erro,auth){
                if(erro) return  res.status(500).send({error: "INTERNAL_ERROR", error_message:erro});

                if(!auth) return res.status(401).send({error: "Forbidden", error_message:"oldpassword is not valid"});
            });
        }else{
            var decoded = jwt.decode(reset_token, require('../app').get('jwtTokenSecret'));
            console.log("Dcoded:" + decoded)
            if(!((usr.hash==decoded.hash) && (usr.salt==decoded.salt)))
            return res.status(401).send({error: "Forbidden", error_message:"reset_token is not valid"});
        }

        usr.setPassword(newpassword, function (err, obj) {
            if(err) return res.status(500).send({error: "internal_error", error_message:err});
            usr.save(function(err, obj){
                    "use strict";
                    if(err) return res.status(500).send({error: "internal_error", error_message:err});
                return res.status(201).send(commonfunctions.generateToken(usr,"user"));
                }
            )
        });

    });
});


module.exports = router;