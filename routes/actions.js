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

    // console.log("???????????????????" + req.body);

    commonfunctions.decode(token,function(err,decoded){
        if(err){
            callb(err,decoded);
        }else callb(null,decoded);
    });
}


// Begin Macro
/**
 * @apiDefine NotFound
 * @apiError 404_NotFound The Object with specified <code>id</code> was not found.<BR>
 * <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR>
 * <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR>
 */


/**
 * @apiDefine NoContent
 * @apiError (2xx) 204_NoConent The query gets no content.
 */

/**
 * @apiDefine  Conflict
 * @apiError 409_Conflict <b>Conflict:</b> Indicates that the request could not be processed because of conflict in the request.
 * For Example a resource could not be deleted because is used from other resource
 * <b>request.body.error</b> contains an error name specifing the Error.<BR>
 * <b>request.body.erro_messager</b> contains an error message specifing the conflict.<BR>
 */

/**
 * @apiDefine Metadata
 * @apiSuccess {Object} _metadata Object containing metadata for pagination info
 * @apiSuccess {Number} _metadata.skip Number of results of this query skipped
 * @apiSuccess {Number} _metadata.limit Limits the number of results to be returned by this query.
 * @apiSuccess {Number} _metadata.totalCount Total number of query results.
 */

/**
 * @apiDefine  ServerError
 * @apiError (Error 5xx) {Object} 500_ServerError Internal Server Error. <BR>
 * <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR>
 * <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR>
 * @apiErrorExample {Object} Error-Response: 500 Internal Server Error
 *     HTTP/1.1 500 Internal Server Error
 *      {
 *         "error": 'Internal Error'
 *         "error_message": 'something blew up, ERROR: No MongoDb Connection'
 *      }
 */

/**
 * @apiDefine  BadRequest
 * @apiError 400_BadRequest The server cannot or will not process the request due to something perceived as a client error<BR>
 * <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR>
 * <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR>
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
 * @apiError 401_Unauthorized Not authorized to call this endpoint.<BR>
 * <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR>
 * <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR>
 * @apiErrorExample Error-Response: 401 Unauthorized
 *     HTTP/1.1 401 Unauthorized
 *      {
 *         "error":"invalid_token",
 *         "error_description":"Unauthorized: The access token expired"
 *      }
 */

/**
 * @apiDefine  InvalidUserAndPassword
 * @apiError 403_Unauthorized Username or password not valid.<BR>
 * <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR>
 * <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR>
 * @apiErrorExample Error-Response: 403 Unauthorized
 *     HTTP/1.1 403 Unauthorized
 *      {
 *         "error":"Unauthorized",
 *         "error_description":"Warning: wrong username"
 *      }
 */

/**
 * @apiDefine GetResource
 * @apiSuccess {Object[]} users a paginated array list of users objects
 * @apiSuccess {String} users.id User id identifier
 * @apiSuccess {String} users.field1 field 1 defined in schema
 * @apiSuccess {String} users.field2 field 2 defined in schema
 * @apiSuccess {String} users.fieldN field N defined in schema
 */

/**
 * @apiDefine GetResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *       "users":[
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "email": "prova@prova.it",
 *                          "name": "prova",
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
 *                   }
 *     }
 */



/**
 * @apiDefine GetAppTypeResource
 * @apiSuccess {Object[]}   userandapptypes             a paginated array list of application types objects
 * @apiSuccess {String}     userandapptypes._id         application type id
 * @apiSuccess {String}     userandapptypes.name        application token type name
 * @apiSuccess {String}     userandapptypes.type        must be equal to "app"
 * @apiSuccess {String}     userandapptypes.super       if set true, the application token type is like an admin token
 * @apiSuccess {String}     [userandapptypes.field1]    field 1: other field defined in application type schema
 * @apiSuccess {String}     [userandapptypes.field2]    field 2: other field defined in application type schema
 * @apiSuccess {String}     [userandapptypes.fieldN]    field N: other field defined in application type schema
 */

/**
 * @apiDefine GetAppTypeResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *       "userandapptypes":[
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "name": "externalApp",
 *                          "type": "app",
 *                          "super": false
 *                      },
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "name": "externalWebUi",
 *                          "type": "app",
 *                          "super": true
 *                     },
 *                    ...
 *                 ],
 *
 *       "_metadata":{
 *                   "skip":10,
 *                   "limit":50,
 *                   "totalCount":100
 *                   }
 *     }
 */
 /**
 * @apiDefine GetUserTypeResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *       "userandapptypes":[
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "name": "cruiser",
 *                          "type": "user",
 *                          "super": false
 *                      },
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "name": "admin",
 *                          "type": "user",
 *                          "super": true
 *                     },
 *                    ...
 *                 ],
 *
 *       "_metadata":{
 *                   "skip":10,
 *                   "limit":50,
 *                   "totalCount":100
 *                   }
 *     }
 */



/**
 * @apiDefine GetUserTypeResource
 * @apiSuccess {Object[]}   userandapptypes             a paginated array list of user token types object
 * @apiSuccess {String}     userandapptypes._id         application type id
 * @apiSuccess {String}     userandapptypes.name        application token type name
 * @apiSuccess {String}     userandapptypes.type        must be equal to "user"
 * @apiSuccess {String}     userandapptypes.super       if set true, the application token type is like an admin token
 * @apiSuccess {String}     [userandapptypes.field1]    field 1: other field defined in application type schema
 * @apiSuccess {String}     [userandapptypes.field2]    field 2: other field defined in application type schema
 * @apiSuccess {String}     [userandapptypes.fieldN]    field N: other field defined in application type schema
 */





// End Macro


/**
 * @api {get} /actions/decodeToken Decode Token - GET
 * @apiVersion 1.0.0
 * @apiName GetDecodeToken
 * @apiGroup Token
 *
 * @apiDescription Protected by access token, it decodes a token and returns the contents bundled in the token
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Query parameter) {String} decode_token Token to be unboxed
 *
 * @apiSuccess (200 - OK) {Boolean} valid           if true, the decoded token is valid and a token field is returned. If false, the decoded token is not valid and an error_message field is returned
 * @apiSuccess (200 - OK) {Object}  [token]         decoded token information - returned only if valid field is true
 * @apiSuccess (200 - OK) {String}  token._id       id of the token owner
 * @apiSuccess (200 - OK) {String}  token.email     email address of the token owner
 * @apiSuccess (200 - OK) {String}  token.type      token owner type
 * @apiSuccess (200 - OK) {String}  token.enabled   if true, the owner is allowed to access the resource
 * @apiSuccess (200 - OK) {String}  token.expires   token expiration date
 * @apiSuccess (200 - OK) {String}  [error_message] error message explaining the problem in decoding the token - returned only if field "valid" is false
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *      {
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                  "enabled":true
 *                }
 *      }
 *
 * @apiSuccessExample {json} Example: 401
 *      HTTP/1.1 401 Not Authorized
 *      {
 *        "valid":"false"
 *        "error_message":"token is expired"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.get('/decodeToken', jwtMiddle.ensureIsAuthorized, function (req, res) {

    decodeToken(req, res, function (err, decoded) {
        if (err) {
            decoded.error_message = decoded.error_message.replace("access_token", "decode_token")
            res.status(err).send(decoded);
        } else res.status(200).send(decoded);
    });

});



/**
 * @api {get} /actions/checkiftokenisauth Get authorisation by role
 * @apiVersion 1.0.0
 * @apiName GetAuthByRole
 * @apiGroup Token
 *
 * @apiDescription Protected by access token, it decodes a token boxed in decode_token parameter and check if this token type
 * has the authorization to access a resource with a particular HTTP method. Returns the contents bundled in the token and
 * a field "valid" that indicates if token is enabled and authorised.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Query parameter) {String} decode_token    Token to be unboxed and verified
 * @apiParam (Query parameter) {String} URI Endpoint    Resource on which you want to access  with a token boxed in decode_token parameter
 * @apiParam (Query parameter) {String} method HTTP     Resource method on which you want to access with a token boxed in decode_token parameter
 *
 * @apiSuccess (200 - OK) {Boolean} valid           if true, the decoded token is valid, this token type is enabled to call this URI with the specified http method and a token field with unboxed content is returned. If false, the decoded token is not valid and an error_message field is returned
 * @apiSuccess (200 - OK) {Object}  [token]         decoded token information - returned only if valid field is true
 * @apiSuccess (200 - OK) {String}  token._id       id of the token owner
 * @apiSuccess (200 - OK) {String}  token.email     email address of the token owner
 * @apiSuccess (200 - OK) {String}  token.type      token owner type
 * @apiSuccess (200 - OK) {String}  token.enabled   if true, the owner is allowed to access the resource
 * @apiSuccess (200 - OK) {String}  token.expires   token expiration date
 * @apiSuccess (200 - OK) {String}  [error_message] error message explaining the problem in decoding the token - returned only if field "valid" is false
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *      {
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                  "enabled":true
 *                }
 *      }
 *
 * @apiSuccessExample {json} Example: 401  Not Authorized
 *      HTTP/1.1 401 Not Authorized
 *      {
 *        "valid":"false"
 *        "error_message":"token is expired"
 *      }
 *  @apiSuccessExample {json} Example:401  Not Authorized
 *      HTTP/1.1 401 Not Authorized
 *      {
 *         "valid":"false"
 *         "error_message":"No auth roles defined for: GET /resource"
 *      }
 * @apiErrorExample Error-Response: 400 BadRequest
 *     HTTP/1.1 400 InvalidRequest
 *     {
 *        "error":"BadRequest",
 *        "error_message":"decode_token parameter is mandatory"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/checkiftokenisauth', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var URI = req.query.URI;
    var method = req.query.method;

    if (!URI) res.status(400).send({error: "BabRequest", error_message: "No URI param provided"});
    if (!method) res.status(400).send({error: "BabRequest", error_message: "No method param provided"});

    decodeToken(req, res, function (err, decoded) { // err == null token is valid else err== status_code to return
        if (err) { // if err token is not valid
            decoded.error_message = decoded.error_message.replace("access_token", "decode_token");
            res.status(err).send(decoded);
        } else { // token is valid

            URI=URI.endsWith("/") ? URI : URI+"/";
            method=method.toUpperCase();
            var typeT=req.decode_results.type;

            authEnpoints.findOne({URI: URI, method: method, name:typeT}, function (err, item) {
                if (err) return res.status(500).send({error: "InternalError", error_message: "Internal Error " + err});
                if (!item) return res.status(401).send({
                    error: "BadRequest",
                    error_message: "No auth roles defined for: " + method + " " + URI
                });

                if (item.authToken.indexOf(decoded.token.type) >= 0)
                    res.status(200).send(decoded);
                else {
                    decoded.valid = false;
                    decoded.error_message = "Only " + item.authToken + " token types can access this resource";
                    res.status(200).send(decoded);
                }

            });
        }
    });

});



/**
 * @api {post} /actions/decodeToken Decode Token - POST
 * @apiVersion 1.0.0
 * @apiName PostDecodeToken
 * @apiGroup Token
 *
 * @apiDescription Accessible by access tokens, it decodes a token and returns the contents bundled in the token
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Query arameter) {String} decode_token Token to be unboxed
 *
 * @apiSuccess (200 - OK) {Boolean} valid           if true, the decoded token is valid and a token field is returned. If false, the decoded token is not valid and an error_message field is returned
 * @apiSuccess (200 - OK) {Object}  [token]         decoded token information - returned only if valid field is true
 * @apiSuccess (200 - OK) {String}  token._id       id of the token owner
 * @apiSuccess (200 - OK) {String}  token.email     email address of the token owner
 * @apiSuccess (200 - OK) {String}  token.type      token owner type
 * @apiSuccess (200 - OK) {String}  token.enabled   if true, the owner is allowed to access the resource
 * @apiSuccess (200 - OK) {String}  token.expires   token expiration date
 * @apiSuccess (200 - OK) {String}  [error_message] error message explaining the problem in decoding the token - returned only if field "valid" is false
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *      {
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                  "enabled":true
 *                }
 *      }
 *
 * @apiSuccessExample {json} Example: 401
 *      HTTP/1.1 401 Not Authorized
 *      {
 *        "valid":"false"
 *        "error_message":"token is expired"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/decodeToken', jwtMiddle.ensureIsAuthorized, function (req, res) {
    //console.log("Decode Token" + JSON.stringify(decode_results));
    decodeToken(req, res, function (err, decoded) {
        if (err) {
            decoded.error_message = decoded.error_message.replace("access_token", "decode_token");
            res.status(err).send(decoded);
        } else res.status(200).send(decoded);
    });

});



/**
 * @api {post} /actions/checkiftokenisauth Check if Token is authorised
 * @apiVersion 1.0.0
 * @apiName CheckIfTokenIsAuth
 * @apiGroup Token
 *
 * @apiDescription Protected by access token, it decodes a token boxed in decode_token parameter and check if this token type
 * has the authorization to access a resource with a particular HTTP method. Returns the contents bundled in the token and
 * a field "valid" that indicates if token is valid end enabled.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} decode_token     Token to be unboxed and verified
 * @apiParam (Body parameter) {String} URI Endpoint     Resource on which you want to access  with a token boxed in decode_token parameter
 * @apiParam (Body parameter) {String} method HTTP      Resource method on which you want to access with a token boxed in decode_token parameter
 *
 * @apiSuccess (200 - OK) {Boolean} valid           if true, the decoded token is valid, this token type is enabled to call this URI with the specified http method and a token field is returned. If false, the decoded token is not valid and an error_message field is returned
 * @apiSuccess (200 - OK) {Object}  [token]         decoded token information - returned only if valid field is true
 * @apiSuccess (200 - OK) {String}  token._id       id of the token owner
 * @apiSuccess (200 - OK) {String}  token.email     email address of the token owner
 * @apiSuccess (200 - OK) {String}  token.type      token owner type
 * @apiSuccess (200 - OK) {String}  token.enabled   if true, the owner is allowed to access the resource
 * @apiSuccess (200 - OK) {String}  token.expires   token expiration date
 * @apiSuccess (200 - OK) {String}  [error_message] error message explaining the problem in decoding the token - returned only if field "valid" is false
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *      {
 *        "valid":"true"
 *        "token":{
 *                  "_id":"eQO7de4AJe-syk",
 *                  "expires":1467394099074,
 *                  "email":"prova@prova.it",
 *                  "type":"webUI",
 *                  "enabled":true
 *                }
 *      }
 *
 * @apiSuccessExample {json} Example: 401  Not Authorized
 *      HTTP/1.1 401 Not Authorized
 *      {
 *        "valid":"false"
 *        "error_message":"token is expired"
 *      }
 *  @apiSuccessExample {json} Example: 401  Not Authorized
 *      HTTP/1.1 401 Not Authorized
 *      {
 *         "valid":"false"
 *         "error_message":"No auth roles defined for: GET /resource"
 *      }
 * @apiErrorExample Error-Response: 400 BadRequest
 *     HTTP/1.1 400 InvalidRequest
 *     {
 *        "error":"BadRequest",
 *        "error_message":"decode_token parameter is mandatory"
 *     }
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/checkiftokenisauth', jwtMiddle.ensureIsAuthorized, function (req, res) {
    //console.log("Decode Token" + JSON.stringify(decode_results));
    var URI = req.body.URI;
    var method = req.body.method;

    if (!URI) res.status(400).send({error: "BabRequest", error_message: "No URI param provided"});
    if (!method) res.status(400).send({error: "BabRequest", error_message: "No method param provided"});

    decodeToken(req, res, function (err, decoded) { // err == null token is valid else err== status_code to return
        if (err) { // if err token is not valid
            decoded.error_message = decoded.error_message.replace("access_token", "decode_token");
            res.status(err).send(decoded);
        } else { // token is valid
            URI=URI.endsWith("/") ? URI : URI+"/";
            method=method.toUpperCase();
            var typeT=req.decode_results.type;

            authEnpoints.findOne({URI: URI, method: method, name:typeT}, function (err, item) {
                if (err) return res.status(500).send({error: "InternalError", error_message: "Internal Error " + err});
                if (!item) return res.status(401).send({
                    error: "BadRequest",
                    error_message: "No auth roles defined for: " + method + " " + URI
                });
                // if(!item){
                //     decoded.valid=false;
                //     decoded.error_message="No auth roles defined for: " + method + " " + URI;
                //     res.status(201).send(decoded);
                // }

                if (item.authToken.indexOf(decoded.token.type) >= 0)
                    res.status(200).send(decoded);
                else {
                    decoded.valid = false;
                    decoded.error_message = "Only " + item.authToken + " token types can access this resource";
                    res.status(200).send(decoded);
                }
            });

        }
    });

});



/**
 * @api {post} /actions/refreshToken Refresh Token
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Token
 *
 * @apiDescription Protected by access token, it renews the token.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} refresh_token    Token used to renew the token
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "refresh_token": "dsadasddfdf6g4fdgfh687gfhf"}
 *
 * @apiSuccess (200 - OK) {Object} apiKey               information about apiKey token
 * @apiSuccess (200 - OK) {String} apiKey.token         consumer token
 * @apiSuccess (200 - OK) {String} apiKey.expires       token expiration date
 * @apiSuccess (200 - OK) {Object} refreshToken         information about refreshToken used to renew a token
 * @apiSuccess (200 - OK) {String} refreshToken.token   authapp refreshToken
 * @apiSuccess (200 - OK) {String} refreshToken.expires refreshToken expiration date
 * @apiSuccess (200 - OK) {String} userId               consumer id
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "apiKey":{
 *                  "token":"VppR5sHU_hV3U",
 *                  "expires":1466789299072
 *                 },
 *        "refreshToken":{
 *                        "token":"eQO7de4AJe-syk",
 *                        "expires":1467394099074
 *                       },
 *        "userId":"4334f423432"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/refreshToken', jwtMiddle.ensureIsAuthorized, function (req, res) {
    "use strict";

    console.log("REFRESHTOKEN");

    decodeToken(req, res, function (err, decoded) {
        if (err) {
            decoded.error_message = decoded.error_message.replace("access_token", "refresh_token");
            res.status(207).send({error: "refreshToken_error", error_message: decoded.error_message});
        }
        else if (decoded.token.mode == "user") { // è un token utente
            console.log("Redirect to MS");
            //res.redirect('/authuser/refreshToken');
            res.status(200).send(commonfunctions.generateToken(decoded.token, "user"));
        } else if (decoded.token.mode == "developer") {// è un token developer
            console.log("Redirect to APP");
            res.status(200).send(commonfunctions.generateToken(decoded.token, "developer"));
        } else {
            return res.status(401).send({
                error: "refreshToken_error",
                error_message: "Can not refresh this token Type"
            });
        }
    });

});



/**
 * @api {get} /actions/gettokentypelist Get Token Type list
 * @apiVersion 1.0.0
 * @apiName GetTokenTypeList
 * @apiGroup Token
 *
 * @apiDescription Protected by microservice access token, it gets a list of valid token types.
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
 * @apiSuccess (200 - OK) {String[]} user   a list of valid and available users tokens
 * @apiSuccess (200 - OK) {String[]} app    a list of valid and available application tokens
 * @apiSuccess (200 - OK) {String[]} ms     a list of valid and available microservice tokens
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *      {
 *        "user":[ "userTypeOne" , "userTypeTwo" .....],
 *        "app":[ "appTypeOne" , "appTypeTwo" .....],
 *        "ms":[ "msTypeOne" , "msTypeTwo" .....]
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/gettokentypelist', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var userType = conf.getParam("userType");
    var appType = conf.getParam("appType");
    var msType = conf.getParam("msType");

    res.status(200).send({user: userType, app: appType, ms: msType});

});



/**
 * @api {get} /actions/getsupeusertokenlist Get superuser Token list
 * @apiVersion 1.0.0
 * @apiName GetSuperUserTokenList
 * @apiGroup Token
 *
 * @apiDescription Protected by microservice access token, it gets a list of valid admin token types.
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
 * @apiSuccess (200 - OK) {String[]} superuser  a list of valid and available admin user tokens
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *          "superuser":[ "userTypeOne" , "userTypeTwo" .....]
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/getsupeusertokenlist', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var list = [];

    appsUsersType.find({super: true, type: "user"}, function (err, values) {
        if (err) return res.status(500).send({error: "InternalError", error_message: "Internal Error " + err});
        async.each(values, function (val, clb) {
            list.push(val.name);
            clb();
        }, function (err) {
            res.status(200).send({superuser: list});
        });
    });

});



/**
 * @api {get} /actions/getsuperapptokenlist Get admin Application Token list
 * @apiVersion 1.0.0
 * @apiName GetAdminApplicationTokenList
 * @apiGroup Token
 *
 * @apiDescription Protected by access token, gets a list of valid super app token types.
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
 * @apiSuccess (200 - OK) {String[]} superapp  a list of valid and available admin app tokens
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 Ok
 *      {
 *          "superapp":[ "appTypeOne" , "appTypeTwo" .....]
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/getsuperapptokenlist', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var list = [];

    appsUsersType.find({super: true, type: "app"}, function (err, values) {
        if (err) return res.status(500).send({error: "InternalError", error_message: "Internal Error " + err});
        async.each(values, function (val, clb) {
            list.push(val.name);
            clb();
        }, function (err) {
            res.status(200).send({superapp: list});
        });
    });

});


module.exports = router;