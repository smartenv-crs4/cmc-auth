var express = require('express');
var router = express.Router();
var User = require('../models/users').User;
var authEnpoints = require('../models/authEndpoints').AuthEndPoint;
var jwtMiddle = require('./jwtauth');
var commonfunctions=require('./commonfunctions');
var conf=require('./configSettingManagment');
var appsUsersType=require('../models/userAndAppTypes').UserAndAppTypes;
var async=require('async');


///* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Caport2020 Auth API Microservice dev' });
//});



function decodeToken(req,res,callb){
    var token = ((req.body && req.body.refresh_token) || (req.query && req.query.refresh_token))||((req.body && req.body.decode_token) || (req.query && req.query.decode_token)); // || req.headers['x-access-token'];

    commonfunctions.decode(token,function(err,decoded){
        if(err){
            callb(err,decoded);
        }else callb(null,decoded);
    });
}


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
 * @api {get} /actions/decodeToken Decode Token
 * @apiVersion 1.0.0
 * @apiName Token Decode
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} decode_token token that should be unboxed
 *
 *
 * @apiSuccess (200 - OK) {Boolean} valid  if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned
 * @apiSuccess (200 - OK) {Boolean} token   contains decoded token information only is valid field is true
 * @apiSuccess (200 - OK) {String}  token._id  contains id about token owner
 * @apiSuccess (200 - OK) {String}  token.email  contains email id about token owner
 * @apiSuccess (200 - OK) {String}  token.type  contains token owner type
 * @apiSuccess (200 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
 * @apiSuccess (200 - OK) {String}  token.expires  contains information about token life
 * @apiSuccess (200 - OK) {String}  error_message  is returned only if field valid is false, and contains error meesage that explain the decoded problem
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                   "enabled:true
 *       }
 *    }
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *
 *        "valid":"false"
 *        "error_message":"token is expired"
 *    }
 *
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.get('/decodeToken', jwtMiddle.ensureIsAuthorized, function(req, res) {
    decodeToken(req,res,function(err,decoded){
        if(err){
            decoded.error_message=decoded.error_message.replace("access_token", "decode_token")
            res.status(err).send(decoded);   
        }else res.status(200).send(decoded);
    });
});



/**
 * @api {get} /actions/checkiftokenisauth Decode Token and check authorizations
 * @apiVersion 1.0.0
 * @apiName Token Decode and check auth
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It decode the token, check if this token type check if this token type
 * has the authorization to call a particular endpoint with a particular Http method (this parameter should be passed like http params ).
 * It return the contents bundled in the token and a filed valid that indicate if token is valid end enabled.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} decode_token token that should be unboxed
 * @apiParam {String} URI endpoint URI on which check if the token is authorized to call it
 * @apiParam {String} method Http method url on which check if the token is authorized to call it
 *
 * @apiSuccess (200 - OK) {Boolean} valid  if true the decoded token is valid and this token type is enabled to call this URI with the specified http method.
 * If valid, a token field is returned otherwise if false the decoded token is not valid or authorized and a error_message field is returned
 * @apiSuccess (200 - OK) {Boolean} token   contains decoded token information only is valid field is true
 * @apiSuccess (200 - OK) {String}  token._id  contains id about token owner
 * @apiSuccess (200 - OK) {String}  token.email  contains email id about token owner
 * @apiSuccess (200 - OK) {String}  token.type  contains token owner type
 * @apiSuccess (200 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
 * @apiSuccess (200 - OK) {String}  token.expires  contains information about token life
 * @apiSuccess (200 - OK) {String}  error_message  is returned only if field valid is false, and contains error message that explain the decoded or unauthorized problem
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                   "enabled:true
 *       }
 *    }
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *
 *        "valid":"false"
 *        "error_message":"token is expired"
 *    }
 *
 *  @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *
 *        "valid":"false"
 *        "error_message":"No auth roles defined for: GET /resource"
 *    }
 *
 * @apiUse Unauthorized
 *  @apiErrorExample Error-Response: 400 BadRequest
 *     HTTP/1.1 400 InvalidRequest
 *      {
 *         error:'BadRequest',
 *         "error_message":"No auth roles defined for: GET /resource"
 *      }
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/checkiftokenisauth', jwtMiddle.ensureIsAuthorized, function(req, res) {
    var URI=req.query.URI;
    var method=req.query.method;

    if(!URI) res.status(400).send({error:"BabRequest", error_message:"No URI param provided"});
    if(!method) res.status(400).send({error:"BabRequest", error_message:"No method param provided"});




    decodeToken(req,res,function(err,decoded){ // err == null token is valid else err== status_code to return
        if(err){ // if err token is not valid
            decoded.error_message=decoded.error_message.replace("access_token", "decode_token");
            res.status(err).send(decoded);
        }else{ // token is valid
            authEnpoints.findOne({URI:URI,method:method},function(err,item){
                if(err) return res.status(500).send({error:"InternalError", error_message:"Internal Error " + err});
                if(!item) return res.status(401).send({error:"BadRequest", error_message:"No auth roles defined for: " + method + " " + URI });

                if(item.authToken.indexOf(decoded.token.type)>=0)
                    res.status(200).send(decoded);
                else{
                    decoded.valid=false;
                    decoded.error_message="Only " + item.authToken +  " token types can access this resource";
                    res.status(200).send(decoded);
                }

            });
        }
    });

});


/**
 * @api {post} /actions/decodeToken Decode Token with post
 * @apiVersion 1.0.0
 * @apiName Token Decode
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It decode the token and return the contents bundled in the token
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} decode_token token that should be unboxed
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "decode_token": "34243243jkh4k32h4k3h43k4"}
 *
 * @apiSuccess (201 - OK) {Boolean} valid  if true the decoded token is valid and a token field is returned otherwise if false the decoded token is not valid and a error_message field is returned
 * @apiSuccess (201 - OK) {Boolean} token  contains decoded token information only is valid field is true
 * @apiSuccess (201 - OK) {String}  token._id  contains id about token owner
 * @apiSuccess (201 - OK) {String}  token.email  contains email id about token owner
 * @apiSuccess (201 - OK) {String}  token.type  contains token owner type
 * @apiSuccess (201 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
 * @apiSuccess (201 - OK) {String}  token.expires  contains information about token life
 * @apiSuccess (201 - OK) {String}  error_message  is returned only if field valid is false, and contains error meesage that explain the decoded problem
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 201 Ok
 *
 *     {
 *
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                   "enabled:true
 *       }
 *    }
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 201 Ok
 *
 *     {
 *
 *        "valid":"false"
 *        "error_message":"token is expired"
 *    }
 *
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.post('/decodeToken', jwtMiddle.ensureIsAuthorized, function(req, res) {
    //console.log("Decode Token" + JSON.stringify(decode_results));
    decodeToken(req,res,function(err,decoded){
        if(err){
            decoded.error_message=decoded.error_message.replace("access_token", "decode_token");
            res.status(err).send(decoded);
        }else res.status(201).send(decoded);
    });

});





/**
 * @api {post} /actions/checkiftokenisauth Decode Token and check authorizations with POST
 * @apiVersion 1.0.0
 * @apiName Token Decode and check auth
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It decode the token, check if this token type check if this token type
 * has the authorization to call a particular endpoint with a particular Http method (this parameter should be passed like http params ).
 * It return the contents bundled in the token and a filed valid that indicate if token is valid end enabled.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} decode_token token that should be unboxed
 * @apiParam {String} URI endpoint URI on which check if the token is authorized to call it
 * @apiParam {String} method Http method url on which check if the token is authorized to call it
 *
 * @apiSuccess (201 - OK) {Boolean} valid  if true the decoded token is valid and this token type is enabled to call this URI with the specified http method.
 * If valid, a token field is returned otherwise if false the decoded token is not valid or authorized and a error_message field is returned
 * @apiSuccess (201 - OK) {Boolean} token   contains decoded token information only is valid field is true
 * @apiSuccess (201 - OK) {String}  token._id  contains id about token owner
 * @apiSuccess (201 - OK) {String}  token.email  contains email id about token owner
 * @apiSuccess (201 - OK) {String}  token.type  contains token owner type
 * @apiSuccess (201 - OK) {String}  token.enabled  if true the owner is enabled to access the resource
 * @apiSuccess (201 - OK) {String}  token.expires  contains information about token life
 * @apiSuccess (201 - OK) {String}  error_message  is returned only if field valid is false, and contains error message that explain the decoded or unauthorized problem
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 201 Ok
 *
 *     {
 *
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                   "enabled:true
 *       }
 *    }
 *
 *
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 201 Ok
 *
 *     {
 *
 *        "valid":"false",
 *        error_message=""Only userMs, WebUi token types can access this resource"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                   "enabled:true
 *       }
 *    }
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 201 Ok
 *
 *     {
 *        "valid":"false"
 *        "error_message":"token is expired"
 *     }
 *
 *
 * @apiUse Unauthorized
 *  @apiErrorExample Error-Response: 400 BadRequest
 *     HTTP/1.1 400 InvalidRequest
 *      {
 *         error:'BadRequest',
 *         "error_message":"No auth roles defined for: GET /resource"
 *      }
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.post('/checkiftokenisauth', jwtMiddle.ensureIsAuthorized, function(req, res) {
    //console.log("Decode Token" + JSON.stringify(decode_results));
    var URI=req.body.URI;
    var method=req.body.method;

    if(!URI) res.status(400).send({error:"BabRequest", error_message:"No URI param provided"});
    if(!method) res.status(400).send({error:"BabRequest", error_message:"No method param provided"});

    decodeToken(req,res,function(err,decoded){ // err == null token is valid else err== status_code to return
        if(err){ // if err token is not valid
            decoded.error_message=decoded.error_message.replace("access_token", "decode_token");
            res.status(err).send(decoded);
        }else{ // token is valid
            authEnpoints.findOne({URI:URI,method:method},function(err,item){
               if(err) return res.status(500).send({error:"InternalError", error_message:"Internal Error " + err});
               if(!item) return res.status(401).send({error:"BadRequest", error_message:"No auth roles defined for: " + method + " " + URI });
                // if(!item){
                //     decoded.valid=false;
                //     decoded.error_message="No auth roles defined for: " + method + " " + URI;
                //     res.status(201).send(decoded);
                // }

                if(item.authToken.indexOf(decoded.token.type)>=0)
                    res.status(201).send(decoded);
                else{
                    decoded.valid=false;
                    decoded.error_message="Only " + item.authToken +  " token types can access this resource";
                    res.status(201).send(decoded);
                }

            });
        }
    });
});

/**
 * @api {post} /actions/refreshToken Renew the token
 * @apiVersion 1.0.0
 * @apiName Renew Token
 * @apiGroup Token
 *
 * @apiDescription Accessible by Microservice access_token. It renew the token
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} refresh_token token used to renew the token
 *
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "refresh_token": "dsadasddfdf6g4fdgfh687gfhf"}
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
 */
router.post('/refreshToken',jwtMiddle.ensureIsAuthorized, function(req, res){
    "use strict";

        console.log("REFRESHTOKEN");

        decodeToken(req,res,function(err,decoded){
            if(err) {
                decoded.error_message=decoded.error_message.replace("access_token", "refresh_token");
                res.status(207).send({error: "refreshToken_error", error_message: decoded.error_message});
            }
            else if(decoded.token.mode=="user") { // è un token utente
                console.log("Redirect to MS");
                //res.redirect('/authuser/refreshToken');
                res.status(201).send(commonfunctions.generateToken(decoded.token,"user"));
            }else if(decoded.token.mode=="developer"){// è un token developer
                console.log("Redirect to APP");
                res.status(201).send(commonfunctions.generateToken(decoded.token,"developer"));
            } else{
                return res.status(401).send({error: "refreshToken_error",error_message:"Can not refresh this token Type"});
            }
        });
});






/**
 * @api {get} /actions/gettokentypelist Decode Token and check authorizations
 * @apiVersion 1.0.0
 * @apiName Get All Token Type List
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It get a list of valid token types.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 *
 * @apiSuccess (200 - OK) {String[]} user  a list of valid and available users tokens
 * @apiSuccess (200 - OK) {String[]} app  a list of valid and available application tokens
 * @apiSuccess (200 - OK) {String[]} ms  a list of valid and available microservice tokens
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *
 *
 *        "user":[ "userTypeOne" , "userTypeTwo" .....],
 *        "app":[ "appTypeOne" , "appTypeTwo" .....],
 *        "ms":[ "msTypeOne" , "msTypeTwo" .....]
 *     }
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/gettokentypelist', jwtMiddle.ensureIsAuthorized, function(req, res) {
    var userType=conf.getParam("userType");
    var appType=conf.getParam("appType");
    var msType=conf.getParam("msType");
    res.status(200).send({user:userType,app:appType,ms:msType});
});


/**
 * @api {get} /actions/getsupeusertokenlist Return admin user list
 * @apiVersion 1.0.0
 * @apiName Get All admin Token Type List
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It get a list of valid admin token types.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 *
 * @apiSuccess (200 - OK) {String[]} superuser  a list of valid and available admin users tokens
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *          "superuser":[ "userTypeOne" , "userTypeTwo" .....]
 *     }
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/getsupeusertokenlist', jwtMiddle.ensureIsAuthorized, function(req, res) {

    var list=[];
    appsUsersType.find({super:true,type:"user"},function(err,values){
        if(err) return res.status(500).send({error:"InternalError", error_message:"Internal Error " + err});
       async.each(values,function(val,clb){
            list.push(val.name);
           clb();
        },function(err){
           res.status(200).send({superuser:list});
       });
    });

});



/**
 * @api {get} /actions/getsuperapptokenlist Return special app list
 * @apiVersion 1.0.0
 * @apiName Get All special app Token Type List
 * @apiGroup Token
 *
 * @apiDescription Accessible only by other microservice access_token. It get a list of valid super app token types.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 *
 * @apiSuccess (200 - OK) {String[]} superapp  a list of valid and available admin app tokens
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *
 *     {
 *          "superapp":[ "appTypeOne" , "appTypeTwo" .....]
 *     }
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/getsuperapptokenlist', jwtMiddle.ensureIsAuthorized, function(req, res) {

    var list=[];
    appsUsersType.find({super:true,type:"app"},function(err,values){
        if(err) return res.status(500).send({error:"InternalError", error_message:"Internal Error " + err});
        async.each(values,function(val,clb){
            list.push(val.name);
            clb();
        },function(err){
            res.status(200).send({superapp:list});
        });
    });
});



module.exports = router;
