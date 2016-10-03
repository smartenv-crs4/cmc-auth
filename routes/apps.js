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
 * @apiSuccess {Object[]} apps a paginated array list of users objects
 * @apiSuccess {String} apps.id User id identifier
 * @apiSuccess {String} apps.field1 field 1 defined in schema
 * @apiSuccess {String} apps.field2 field 2 defined in schema
 * @apiSuccess {String} apps.fieldN field N defined in schema
 *
 */


/**
 * @apiDefine GetResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *
 *     {
 *       "apps":[
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
 * @api {post} /authapp/signin authapp login
 * @apiVersion 1.0.0
 * @apiName Login Application
 * @apiGroup Application
 *
 * @apiDescription Accessible only other microservice access_token. It login app and return the access_credentials.
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
router.post('/signin', jwtMiddle.ensureIsAuthorized,function (req, res) {

    if(!req.body || _.isEmpty(req.body) ) {
        return res.status(400).send({error:"BadREquest",error_message:'request body missing'});
    }

    if (!req.body.username) return res.status(400).send({error: 'BadRequest', error_message : "No username provided"});


    if (!req.body.password) return res.status(400).send({error: 'BadRequest', error_message : "No password provided"});



    passport.authenticate('local', function(err, app, info) {

        if (err || !app) { return res.status(403).send( { error: 'authentication error', error_message:'You are not correctly authenticated, ' + info.message  }); }

        //if (app.type != "admin" && !app.validated) {return res.status(403).send( { error: 'app not validated', error_message:'The app is not yet validated by the admins or by mail' }); }

        return res.status(201).send(commonfunctions.generateToken(app,"developer"));
    })(req,res);
});





/**
 * @api {post} /authapp/signup Register a new Application
 * @apiVersion 1.0.0
 * @apiName Create Application
 * @apiGroup Application
 *
 * @apiDescription Accessible by Microservice access_token. It create a new Application object and return the access_credentials.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} app the application dictionary with all the fields, only email, password and type are mandatory.
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
    var app = req.body.app;



    if (!app) return res.status(400).send({error: 'BadRequest', error_message : "No app provided"});

    if (!app.email) return res.status(400).send({error: 'BadRequest', error_message : "No email username provided"});
    if (!app.type) return res.status(400).send({error: 'BadRequest', error_message : "No type provided"});

    var password = app.password;
    if (!password) return res.status(400).send({error: 'BadREquest', error_message : "No password provided"});
    delete app['password'];

    if(app.access_token)
        delete app['access_token'];


    //user['validated'] = true;
    if(!(conf.getParam("appType").indexOf(app['type'])>=0))//||  user['type'] == 'admin'
        return res.status(400).send({error: 'BadRequest', error_message : "No valid App Type provided"});


    //console.log("############### SIGN UP");
    try{
        App.register(app, password, function(err, newpp){
            if (err) return res.status(500).send({error: "signup_error",error_message: 'Unable to register app (err:' + err + ')'});

            return res.status(201).send(commonfunctions.generateToken(newpp,"developer"));
        });
    }catch (ex){
        return res.status(500).send({error: "signup_error",error_message: 'Unable to register app (err:' + ex + ')'});
    }

});




/**
 * @api {get} /authapp/ Get all Applications in authMs
 * @apiVersion 1.0.0
 * @apiName Get Applications
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservice access_token, it returns the paginated list of all Applications.
 * To set pagination skip and limit, you can do it in the URL request, for example "get /authapp?skip=10&limit=50"
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

    for (var v in req.query)
        if (App.schema.path(v))
            query[v] = req.query[v];

    App.findAll(query, fields, req.dbPagination, function(err, results){

        if(!err){

            if (!_.isEmpty(results.apps))
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
 * @api {get} /authapp/:id Get the Application in AuthMs by id
 * @apiVersion 1.0.0
 * @apiName GetApplication
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservice access_token, it returns the info about Application in AuthMs microservice.
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the Application
 *
 * @apiSuccess {String} Application.id Application id identifier
 * @apiSuccess {String} Application.field1 field 1 defined in schema
 * @apiSuccess {String} Application.field2 field 2 defined in schema
 * @apiSuccess {String} Application.fieldN field N defined in schema
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

    App.findById(id,fields,function(err,content){
        if(err) return res.status(404).send({error: "GET ERROR",error_message: 'Unable to read user (err:' + err + ')'});

        if(content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error:"Not found", error_message:"Resource not found"});
    });

});




/**
 * @api {delete} /authapp/:id delete Application in AuthMS
 * @apiVersion 1.0.0
 * @apiName Delete Application
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservice access_token, It delete Application and return the deleted resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the Application
 *
 *
 *
 * @apiSuccess (200 - NoContent) {String} ApplicationField_1 Contains field 1 defined in Application Schema(example name)
 * @apiSuccess (200 - NoContent) {String} ApplicationField_2 Contains field 2 defined in Application Schema(example notes)
 * @apiSuccess (200 - NoContent) {String} ApplicationField_N Contains field N defined in Application Schema(example type)
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 200 DELETED
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

    App.findByIdAndRemove(id,function(err,content){
        if(err) return res.status(404).send({error: "delete_error",error_message: 'Unable to delete user (err:' + err + ')'});

        if(content)
            return res.status(200).send(content);
        else
            return res.status(404).send({error:"Not found", error_message:"Resource not found with this Id"});
    });

});



function checked_unchecked(id,value,cb){
    App.findByIdAndUpdate(id,{enabled:value},function(err,updated){
       if(err) cb(err,null);
       else{
           cb(null,updated);
       }

    });
}

function enable_disable(id,value,cb){

    console.log("enbleDisableApp-->"+ id);

    App.findByIdAndUpdate(id,{enabled:value},function(err,updated){
        if(err) cb(err,null);
        else{
            cb(null,updated);
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
 * @api {post} /authapp/:id/actions/enable enable Application in AuthMs
 * @apiVersion 1.0.0
 * @apiName EnableApplication
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservices access_token, It enable the Application.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the Application
 *
 *
 *
 * @apiSuccess (201 - Created) {String} status contains the new Application status
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
            else return res.status(201).send("ok");

        });
    }
);


/**
 * @api {post} /authapp/:id/actions/disable disable Application in AuthMs
 * @apiVersion 1.0.0
 * @apiName DisableApplication
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservices access_token, It disable the Application.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the Application
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

        console.log("Disable");

        var id=req.params.id;

        enable_disable(id,false,function(err,val){
            if(err)  return res.status(207).send({error: "update_error",error_message: err });
            else return res.status(201).send("ok");

        });
    }
);



/**
 * @api {post} /authapp/:id/actions/resetpassword Reset Application password in AuthMs
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservices access_token, It create a reset password Token.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application id to identify the Application
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
 *        "reset_token":"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6", *
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

    App.findById(id,function(err,usr){
        if(err) return res.status(500).send({error: "internal_error", error_message:err});

        if(!usr) return res.status(404).send({error: "NotFound", error_message:"App not Found"});

        var token = jwt.encode({
            id:id,
            hash: usr.hash,
            salt: usr.salt
        }, secret  );
        return res.status(201).send({reset_token: token});

    });
});


/**
 * @api {post} /authapp/:id/actions/setpassword Set new Application password in AuthMs
 * @apiVersion 1.0.0
 * @apiName SetPassword
 * @apiGroup Application
 *
 * @apiDescription Accessible only by microservices access_token, It update Application password.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application to identify the Application
 *
 *
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


    App.findById(id,function(err,apl){
        if(err) return res.status(500).send({error: "internal_error", error_message:err});

        if(!apl) return res.status(404).send({error: "NotFound", error_message:"APP not Found"});


        if(oldpassword){
            apl.authenticate(oldpassword,function(erro,auth){
                if(erro) return  res.status(500).send({error: "INTERNAL_ERROR", error_message:erro});

                if(!auth) return res.status(401).send({error: "Forbidden", error_message:"oldpassword is not valid"});
            });
        }else{
            var decoded = jwt.decode(reset_token, require('../app').get('jwtTokenSecret'));
            console.log("Dcoded:" + decoded)
            if(!((apl.hash==decoded.hash) && (apl.salt==decoded.salt)))
                return res.status(401).send({error: "Forbidden", error_message:"reset_token is not valid"});
        }

        apl.setPassword(newpassword, function (err, obj) {
            if(err) return res.status(500).send({error: "internal_error", error_message:err});
            apl.save(function(err, obj){
                    "use strict";
                    if(err) return res.status(500).send({error: "internal_error", error_message:err});
                    return res.status(201).send(commonfunctions.generateToken(apl,"developer"));

                }
            )
        });

    });
});


module.exports = router;