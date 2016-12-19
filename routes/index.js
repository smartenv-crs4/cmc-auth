var express = require('express');
var router = express.Router();
var microservices = require('../models/microservices').Microservice;
var authEnpoints = require('../models/authEndpoints').AuthEndPoint;
var jwtMiddle = require('./jwtauth');
var commonfunctions=require('./commonfunctions');
var request=require("request");





var conf=require('../routes/configSettingManagment');
var iconsList=conf.getParam("iconsList");


router.get('/main', function(req, res) {
    var action=req.signedCookies.action || null;

    if(action=="log") {

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
        var gwConf= (gwBaseUrl!="") ? gwBaseUrl + "/" + conf.getParam("apiVersion") : "";
        res.render('main', {
            MicroSL: conf.getParam("microserviceList"),
            myUrl: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
            myToken: conf.getParam("MyMicroserviceToken"),
            iconsList: iconsList
        });
    }
    else {
        res.status(401).send({error:"Unauthorized", error_message:"You are not authorized to access this resource"});
    }
});



/* GET home page. */
router.get('/configure', function(req, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('start', {read:"No"});
});



/* GET home page. */
router.get('/login', function(req, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
    var gwConf= (gwBaseUrl!="") ? gwBaseUrl + "/" + conf.getParam("apiVersion") : "";
    res.render('login', {
        next: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
        at: conf.getParam("MyMicroserviceToken")
    });
});

// /* GET home page. */
// router.get('/configure', function(req, res) {
//
// var action=req.signedCookies.action || null;
//
//  console.log("XXXXXXXXXXXXXXX " + action + " XXXXXXXXXXXXXX");
//
//  console.log("Rendering " + conf.getParam("msType"));
//
//
//     if(action=="log") {
//
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.render('main', {
//             MicroSL: conf.getParam("microserviceList"),
//             myUrl: conf.getParam("myMicroserviceBaseUrl"),
//             myToken: conf.getParam("MyMicroserviceToken"),
//             iconsList: iconsList
//         });
//     }
//     else {
//         //res.cookie("action","log");
//         console.log("LOGIN");
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.render('login', {
//             next: conf.getParam("myMicroserviceBaseUrl"),
//             at: conf.getParam("MyMicroserviceToken")
//         });
//     }
// });



/* GET home page. */
router.post('/configure', function(req, res) {

    var ms = {
        "username": req.body.username,
        "password": req.body.password
    };
    var userBody = JSON.stringify(ms);
    // console.log("BODY " + userBody);

    var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
    var gwConf= (gwBaseUrl!="") ? gwBaseUrl + "/" + conf.getParam("apiVersion") : "";
    request.post({
        url: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf + "/authuser/signin",
        body: userBody,
        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.getParam("MyMicroserviceToken")}
    }, function (error, response,body) {
        console.log(body);
        respb=JSON.parse(body);
        if (respb.error_message){
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
            var gwConf= (gwBaseUrl!="") ? gwBaseUrl + "/" + conf.getParam("apiVersion") : "";
            res.render('login', {
                next: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
                at: conf.getParam("MyMicroserviceToken"),
                error_message:respb.error_message
            });
        }
        else {
            res.cookie("action","log",{ signed: true });
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.render('start', {read:"Yes"});
        }
    });
});



/* GET home page. */
router.post('/logout', function(req, res) {
    res.clearCookie("action");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('start', {read:"No"});
});



// /* GET home page. */
// router.post('/logout', function(req, res) {
//     res.clearCookie("action");
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.render('login', {
//         next: conf.getParam("myMicroserviceBaseUrl"),
//         at: conf.getParam("MyMicroserviceToken")
//     });
// });



/* GET home page. */
router.get('/', function(req, res) {
 res.render('index', { title: 'Caport2020 Auth API Microservice dev' });
});



/* GET home page. */
router.get('/env', function(req, res) {
 var env;
 if (process.env['NODE_ENV'] === 'dev')
      env='dev';
 else
      env='production';

 res.status(200).send({env:env});
});

//
//
// function decodeToken(req,res,callb){
//     var token = ((req.body && req.body.refresh_token) || (req.query && req.query.refresh_token))||((req.body && req.body.decode_token) || (req.query && req.query.decode_token)); // || req.headers['x-access-token'];
//
//     commonfunctions.decode(token,function(err,decoded){
//         if(err){
//             callb(err,decoded);
//         }else callb(null,decoded);
//     });
// }
//
// // Begin Macro
// /**
//  * @apiDefine  NotFound
//  * @apiError 404_NotFound <b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR>
//  * <b>request.body.error</b> contains an error name specifing the not Found Error.<BR>
//  * <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR>
//  */
//
// /**
//  * @apiDefine Metadata
//  * @apiSuccess {Object} _metadata object containing metadata for pagination information
//  * @apiSuccess {Number} _metadata.skip  Skips the first skip results of this Query
//  * @apiSuccess {Number} _metadata.limit  Limits the number of results to be returned by this Query.
//  * @apiSuccess {Number} _metadata.totalCount Total number of query results.
//  */
//
//
// /**
//  * @apiDefine  ServerError
//  * @apiError 500_ServerError <b>ServerError:</b>Internal Server Error. <BR>
//  * <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR>
//  * <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR>
//  * @apiErrorExample Error-Response: 500 Internal Server Error
//  *     HTTP/1.1 500 Internal Server Error
//  *      {
//  *         error: 'Internal Error'
//  *         error_message: 'something blew up, ERROR: No MongoDb Connection'
//  *      }
//  */
//
// /**
//  * @apiDefine  BadRequest
//  * @apiError 400_BadRequest <b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR>
//  * <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR>
//  * <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR>
//  *
//  *  @apiErrorExample Error-Response: 400 BadRequest
//  *     HTTP/1.1 400 InvalidRequest
//  *      {
//  *         error:'BadRequest',
//  *         error_message:'no body sended',
//  *      }
//  */
//
//
//
// /**
//  * @apiDefine  Unauthorized
//  * @apiError 401_Unauthorized <strong>Unauthorized:</strong> not authorized to call this endpoint.<BR>
//  * <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR>
//  * <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create admin user</i><BR>
//  * @apiErrorExample Error-Response: 401 Unauthorized
//  *     HTTP/1.1 401 Unauthorized
//  *      {
//  *         error:"invalid_token",
//  *         error_description:"Unauthorized: The access token expired"
//  *      }
//  */
//
//
//
// /**
//  * @apiDefine  IvalidUserAanPassword
//  * @apiError 403_Unauthorized <strong>Unauthorized:</strong> username or password not valid.<BR>
//  * <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR>
//  * <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR>
//  * @apiErrorExample Error-Response: 403 Unauthorized
//  *     HTTP/1.1 403 Unauthorized
//  *      {
//  *         error:"Unauthorized",
//  *         error_description:"Warning: wrong username"
//  *      }
//  */
//
//
//
//
// /**
//  * @apiDefine GetResource
//  * @apiSuccess {Object[]} users a paginated array list of users objects
//  * @apiSuccess {String} users.id User id identifier
//  * @apiSuccess {String} users.field1 field 1 defined in schema
//  * @apiSuccess {String} users.field2 field 2 defined in schema
//  * @apiSuccess {String} users.fieldN field N defined in schema
//  *
//  */
//
//
// /**
//  * @apiDefine GetResourceExample
//  * @apiSuccessExample {json} Example: 200 OK, Success Response
//  *
//  *     {
//  *       "users":[
//  *                      {
//  *                          "_id": "543fdd60579e1281b8f6da92",
//  *                          "email": "prova@prova.it",
//  *                           "name": "prova",
//  *                          "notes": "Notes About prova"
//  *                      },
//  *                      {
//  *                       "id": "543fdd60579e1281sdaf6da92",
//  *                          "email": "prova1@prova.it",
//  *                          "name": "prova1", *
//  *                          "notes": "Notes About prova1"
//  *
//  *                     },
//  *                    ...
//  *                 ],
//  *
//  *       "_metadata":{
//  *                   "skip":10,
//  *                   "limit":50,
//  *                   "totalCount":100
//  *               }
//  *    }
//  */
//
//
// // End Macro
//
//
//
//
// /**
//  * @api {get} /decodeToken Decode Token
//  * @apiVersion 1.0.0
//  * @apiName Token Decode
//  * @apiGroup Token
//  *
//  * @apiDescription Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token
//  *
//  *
//  * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
//  * @apiParam {String} decode_token token that should be unboxed
//  *
//  *
//  * @apiSuccess (200 - OK) {Boolean} valid  if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned
//  * @apiSuccess (200 - OK) {Boolean} token   contains decoded token information only is valid field is true
//  * @apiSuccess (200 - OK) {String}  token._id  contains id about token owner
//  * @apiSuccess (200 - OK) {String}  token.email  contains email id about token owner
//  * @apiSuccess (200 - OK) {String}  token.type  contains token owner type
//  * @apiSuccess (200 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
//  * @apiSuccess (200 - OK) {String}  token.expires  contains information about token life
//  * @apiSuccess (200 - OK) {String}  error_message  is returned only if field valid is false, and contains error meesage that explain the decoded problem
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"true"
//  *        "token":{
//  *                  "_id":"eQO7de4AJe-syk",
//  *                  "expires":1467394099074,
//  *                  "email":"prova@prova.it",
//  *                  "type":"webUI",
//  *                   "enabled:true
//  *       }
//  *    }
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"false"
//  *        "error_message":"token is expired"
//  *    }
//  *
//  *
//  * @apiUse Unauthorized
//  * @apiUse BadRequest
//  * @apiUse ServerError
//  *
//  */
// router.get('/decodeToken', jwtMiddle.ensureIsAuthorized, function(req, res) {
//     decodeToken(req,res,function(err,decoded){
//         if(err){
//             decoded.error_message=decoded.error_message.replace("access_token", "decode_token")
//             res.status(err).send(decoded);
//         }else res.status(200).send(decoded);
//     });
// });
//
//
//
// /**
//  * @api {get} /decodeToken Decode Token
//  * @apiVersion 1.0.0
//  * @apiName Token Decode
//  * @apiGroup Token
//  *
//  * @apiDescription Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token
//  *
//  *
//  * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
//  * @apiParam {String} decode_token token that should be unboxed
//  *
//  *
//  * @apiSuccess (200 - OK) {Boolean} valid  if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned
//  * @apiSuccess (200 - OK) {Boolean} token   contains decoded token information only is valid field is true
//  * @apiSuccess (200 - OK) {String}  token._id  contains id about token owner
//  * @apiSuccess (200 - OK) {String}  token.email  contains email id about token owner
//  * @apiSuccess (200 - OK) {String}  token.type  contains token owner type
//  * @apiSuccess (200 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
//  * @apiSuccess (200 - OK) {String}  token.expires  contains information about token life
//  * @apiSuccess (200 - OK) {String}  error_message  is returned only if field valid is false, and contains error meesage that explain the decoded problem
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"true"
//  *        "token":{
//  *                  "_id":"eQO7de4AJe-syk",
//  *                  "expires":1467394099074,
//  *                  "email":"prova@prova.it",
//  *                  "type":"webUI",
//  *                   "enabled:true
//  *       }
//  *    }
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"false"
//  *        "error_message":"token is expired"
//  *    }
//  *
//  *
//  * @apiUse Unauthorized
//  * @apiUse BadRequest
//  * @apiUse ServerError
//  */
// router.get('/checkiftokenisauth', jwtMiddle.ensureIsAuthorized, function(req, res) {
//     var URI=req.query.URI;
//     var method=req.query.method;
//
//     if(!URI) res.status(400).send({error:"BabRequest", error_message:"No URI param provided"});
//     if(!method) res.status(400).send({error:"BabRequest", error_message:"No method param provided"});
//
//     decodeToken(req,res,function(err,decoded){
//         if(err){
//             decoded.error_message=decoded.error_message.replace("access_token", "decode_token");
//             res.status(err).send(decoded);
//         }else{
//             authEnpoints.findOne({URI:URI,method:method},function(err,item){
//                 if(err) return res.status(500).send({error:"InternalError", error_message:"Internal Error " + err});
//                 if(!item) return res.status(200).send({valid:false, error_message:"No auth roles defined for: " + method + " " + URI });
//                 res.status(200).send(decoded);
//             });
//         }
//     });
// });
//
//
// /**
//  * @api {post} /decodeToken Decode Token with post
//  * @apiVersion 1.0.0
//  * @apiName Token Decode
//  * @apiGroup Token
//  *
//  * @apiDescription Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token
//  *
//  *
//  * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
//  * @apiParam {String} decode_token token that should be unboxed
//  *
//  * @apiParamExample {json} Request-Example:
//  * HTTP/1.1 POST request
//  *  Body:{ "decode_token": "34243243jkh4k32h4k3h43k4"}
//  *
//  * @apiSuccess (200 - OK) {Boolean} valid  if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned
//  * @apiSuccess (200 - OK) {Boolean} token  contains decoded token information only is valid field is true
//  * @apiSuccess (200 - OK) {String}  token._id  contains id about token owner
//  * @apiSuccess (200 - OK) {String}  token.email  contains email id about token owner
//  * @apiSuccess (200 - OK) {String}  token.type  contains token owner type
//  * @apiSuccess (200 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
//  * @apiSuccess (200 - OK) {String}  token.expires  contains information about token life
//  * @apiSuccess (200 - OK) {String}  error_message  is returned only if field valid is false, and contains error meesage that explain the decoded problem
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"true"
//  *        "token":{
//  *                  "_id":"eQO7de4AJe-syk",
//  *                  "expires":1467394099074,
//  *                  "email":"prova@prova.it",
//  *                  "type":"webUI",
//  *                   "enabled:true
//  *       }
//  *    }
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"false"
//  *        "error_message":"token is expired"
//  *    }
//  *
//  *
//  * @apiUse Unauthorized
//  * @apiUse BadRequest
//  * @apiUse ServerError
//  */
// router.post('/decodeToken', jwtMiddle.ensureIsAuthorized, function(req, res) {
//     //console.log("Decode Token" + JSON.stringify(decode_results));
//     decodeToken(req,res,function(err,decoded){
//         if(err){
//             decoded.error_message=decoded.error_message.replace("access_token", "decode_token");
//             res.status(err).send(decoded);
//         }else res.status(201).send(decoded);
//     });
//
// });
//
//
//
//
//
// /**
//  * @api {post} /decodeToken Decode Token with post
//  * @apiVersion 1.0.0
//  * @apiName Token Decode
//  * @apiGroup Token
//  *
//  * @apiDescription Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token
//  *
//  *
//  * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
//  * @apiParam {String} decode_token token that should be unboxed
//  *
//  * @apiParamExample {json} Request-Example:
//  * HTTP/1.1 POST request
//  *  Body:{ "decode_token": "34243243jkh4k32h4k3h43k4"}
//  *
//  * @apiSuccess (200 - OK) {Boolean} valid  if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned
//  * @apiSuccess (200 - OK) {Boolean} token  contains decoded token information only is valid field is true
//  * @apiSuccess (200 - OK) {String}  token._id  contains id about token owner
//  * @apiSuccess (200 - OK) {String}  token.email  contains email id about token owner
//  * @apiSuccess (200 - OK) {String}  token.type  contains token owner type
//  * @apiSuccess (200 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
//  * @apiSuccess (200 - OK) {String}  token.expires  contains information about token life
//  * @apiSuccess (200 - OK) {String}  error_message  is returned only if field valid is false, and contains error meesage that explain the decoded problem
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"true"
//  *        "token":{
//  *                  "_id":"eQO7de4AJe-syk",
//  *                  "expires":1467394099074,
//  *                  "email":"prova@prova.it",
//  *                  "type":"webUI",
//  *                   "enabled:true
//  *       }
//  *    }
//  *
//  * @apiSuccessExample {json} Example: 200 OK
//  *      HTTP/1.1 200 Ok
//  *
//  *     {
//  *
//  *        "valid":"false"
//  *        "error_message":"token is expired"
//  *    }
//  *
//  *
//  * @apiUse Unauthorized
//  * @apiUse BadRequest
//  * @apiUse ServerError
//  */
// router.post('/checkiftokenisauth', jwtMiddle.ensureIsAuthorized, function(req, res) {
//     //console.log("Decode Token" + JSON.stringify(decode_results));
//     var URI=req.body.URI;
//     var method=req.body.method;
//
//     if(!URI) res.status(400).send({error:"BabRequest", error_message:"No URI param provided"});
//     if(!method) res.status(400).send({error:"BabRequest", error_message:"No method param provided"});
//
//     decodeToken(req,res,function(err,decoded){
//         if(err){
//             decoded.error_message=decoded.error_message.replace("access_token", "decode_token");
//             res.status(err).send(decoded);
//         }else{
//             authEnpoints.findOne({URI:URI,method:method},function(err,item){
//                if(err) return res.status(500).send({error:"InternalError", error_message:"Internal Error " + err});
//                if(!item) return res.status(201).send({valid:false, error_message:"No auth roles defined for: " + method + " " + URI });
//                res.status(201).send(decoded);
//             });
//         }
//     });
// });
//
//
//
//
// /**
//  * @api {post} /refreshToken Renew the token
//  * @apiVersion 1.0.0
//  * @apiName Renew Token
//  * @apiGroup Token
//  *
//  * @apiDescription Accessible by Microservice access_token. It renew the token
//  *
//  *
//  * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
//  * @apiParam {String} refresh_token token used to renew the token
//  *
//  *
//  * @apiParamExample {json} Request-Example:
//  * HTTP/1.1 POST request
//  *  Body:{ "refresh_token": "dsadasddfdf6g4fdgfh687gfhf"}
//  *
//  * @apiSuccess (201 - Created) {Object} apiKey  contains information about apiKey token
//  * @apiSuccess (201 - Created) {String} apiKey.token  contains authapp Token
//  * @apiSuccess (201 - Created) {String} apiKey.expires  contains information about token life
//  * @apiSuccess (201 - Created) {Object} refreshToken  contains information about refreshToken used to renew token
//  * @apiSuccess (201 - Created) {String} refreshToken.token  contains authapp refreshToken
//  * @apiSuccess (201 - Created) {String} refreshToken.expires  contains information about refreshToken life
//  * @apiSuccess (201 - Created) {String} userId  contains the id of app in authMS
//  *
//  *
//  * @apiSuccessExample {json} Example: 201 CREATED
//  *      HTTP/1.1 201 CREATED
//  *
//  *     {
//  *
//  *        "apiKey":{
//  *                  "token":"VppR5sHU_hV3U",
//  *                  "expires":1466789299072
//  *        },
//  *        "refreshToken":{
//  *                  "token":"eQO7de4AJe-syk",
//  *                  "expires":1467394099074
//  *       },
//  *       "userId":"4334f423432"
//  *    }
//  *
//  * @apiUse Unauthorized
//  * @apiUse BadRequest
//  * @apiUse ServerError
//  */
// router.post('/refreshToken',jwtMiddle.ensureIsAuthorized, function(req,res){
//     "use strict";
//
//         console.log("REFRESHTOKEN");
//
//         decodeToken(req,res,function(err,decoded){
//             if(err) {
//                 decoded.error_message=decoded.error_message.replace("access_token", "refresh_token");
//                 res.status(207).send({error: "refreshToken_error", error_message: decoded.error_message});
//             }
//             else if(decoded.token.mode=="user") { // è un token utente
//                 console.log("Redirect to MS");
//                 //res.redirect('/authuser/refreshToken');
//                 res.status(201).send(commonfunctions.generateToken(decoded.token,"user"));
//             }else if(decoded.token.mode=="developer"){// è un token developer
//                 console.log("Redirect to APP");
//                 res.status(201).send(commonfunctions.generateToken(decoded.token,"developer"));
//             } else{
//                 return res.status(401).send({error: "refreshToken_error",error_message:"Can not refresh this token Type"});
//             }
//         });
// });
//
//
module.exports = router;
