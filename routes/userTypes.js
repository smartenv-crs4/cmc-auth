var express = require('express');
var router = express.Router();
var tokenTypes = require('../models/userAndAppTypes').UserAndAppTypes;
var tokenTypesSchema = require('../models/userAndAppTypes').UserAndAppTypesSchema;
var authorization = require('../models/authEndpoints').AuthEndPoint;
var Users = require('../models/users').User;
var jwtMiddle = require('./jwtauth');
var commonfunctions=require('./commonfunctions');
var conf=require('./configSettingManagment');
var util=require('util');
var _= require('underscore');
var middlewares=require('./middlewares');
var async=require('async');


router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);
// Begin Macro
/**
 * @apiDefine  NotFound
 * @apiError 404_NotFound <b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR>
 * <b>request.body.error</b> contains an error name specifing the not Found Error.<BR>
 * <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR>
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
 * @apiSuccess {Object[]} userandapptypes a paginated array list of users type objects
 * @apiSuccess {String} userandapptypes.id users type id identifier
 * @apiSuccess {String} userandapptypes.name name of user type
 * @apiSuccess {String} userandapptypes.type type class of token. must be equal to string "user".
 *
 */


/**
 * @apiDefine GetResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *
 *     {
 *       "userandapptypes":[
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "name": "externalApp",
 *                           "type": "user",
 *
 *                      },
 *                      {
 *                       "id": "543fdd60579e1281sdaf6da92",
 *                          "name": "developer",
 *                          "type": "user",
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
 * @api {get} /usertypes Get all user types
 * @apiVersion 1.0.0
 * @apiName GetAllUserTypes
 * @apiGroup UserType
 *
 * @apiDescription Accessible only by other microservice access_token. It return a paginated list of all available user types.
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
 * @apiUse NotFound
 * @apiUse ServerError
 *
 */
router.get('/', jwtMiddle.ensureIsMicroservice, function(req, res) {

    var query = {};

    for (var v in req.query)
        if (tokenTypes.schema.path(v))
            query[v] = req.query[v];

    query.type="user";

    tokenTypes.findAll(query,req.dbQueryFields, req.dbPagination, function(err, usertypeslist){

        if(!err){


            if (! _.isEmpty(usertypeslist.userandapptypes))
                return res.status(200).send(usertypeslist);
            else
                return res.status(404).send({error:"Not found", error_message:"Resource not found"});
        }
        else{
            return res.status(500).send({error:'internal_error', error_message: 'something blew up, ERROR:'+err  });
        }
    });
});



/**
 * @api {get} /usertypes/:id Get user type by Id
 * @apiVersion 1.0.0
 * @apiName GetUserTypeById
 * @apiGroup UserType
 *
 * @apiDescription Accessible only by other microservice access_token. given a determinate Id, It return user type info.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 * @apiParam {String} id the user type id to identify it.
 *
 *
 * @apiSuccess {String} _id user type id identifier
 * @apiSuccess {String} name user type name
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *
 *     {
 *
 *        "_id": "543fdd60579e1281b8f6da92",
 *        "name": "externalWebUi"
 *     }
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/:id',jwtMiddle.ensureIsMicroservice, function (req, res) {

    var id = req.param('id').toString();


    tokenTypes.findById(id,function(err,content){
        if(err) return res.status(500).send({error: "Internal Eroor",error_message: 'Unable to read user token types(err:' + err + ')'});



        if(!content)
            return res.status(404).send({error:"NotFoud", error_message:"no users type with this Id"});
        else{
            delete content['type'];
            return res.status(200).send(content);
        }

    });

});


/**
 * @api {delete} /usertypes/:id delete user type
 * @apiVersion 1.0.0
 * @apiName DeleteUserType
 * @apiGroup UserType
 *
 * @apiDescription Accessible only by microservice access_token, It delete user type and return the deleted resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 * @apiParam {String} id the Application id to identify the user type
 *
 *
 *
 * @apiSuccess (200 - OK) {String} _id user tyoe id identifier
 * @apiSuccess (200 - OK) {String} name user type name
 *
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 - OK
 *
 *     {
 *        "_id":"543fdd60579e1281b8f6da92",
 *        "name":"externalWebUi"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse Conflict
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.delete('/:id',jwtMiddle.ensureIsMicroservice, function (req, res) {

    var id = req.param('id').toString();
    
    tokenTypes.findByIdAndRemove(id,function(err,content){
        if(err) return res.status(500).send({error: "delete_error",error_message: 'Unable to delete user token type (err:' + err + ')'});

        if(content){
            Users.find({type:content.name},function (err,values) {
                if(err){
                    tokenTypes.create(content,function(err,data){
                        if(err){
                            return res.status(500).send({error: "delete_error",error_message: 'token type ' + content.name + ' is deleted but some user of this type could be exist)'});
                        } else{
                            return res.status(409).send({error: "Warning",error_message: 'token type ' + content.name + ' is not deleted due some user of this type could be exist)'});
                        }
                    });

                }else{
                    if(!_.isEmpty(values)) {
                        content=JSON.parse(JSON.stringify(content));
                        tokenTypes.create(content, function (err, data) {
                            if (err) {
                                return res.status(500).send({
                                    error: "delete_error",
                                    error_message: 'token type ' + content.name + ' is deleted but some user of this type could be exist'
                                });
                            } else {
                                return res.status(409).send({
                                    error: "Warning",
                                    error_message: 'token type ' + content.name + ' is not deleted due some user of this type could be exist'
                                });
                            }
                        });
                    }else{
                        authorization.find({authToken:content.name},function (err,values) {
                            if(err){
                                tokenTypes.create(content,function(err,data){
                                    if(err){
                                        return res.status(500).send({error: "delete_error",error_message: 'token type ' + content.name + ' is deleted but some users of this type could be exist'});
                                    } else{
                                        return res.status(409).send({error: "Warning",error_message: 'token type ' + content.name + ' is not deleted due some users of this type could be exist'});
                                    }
                                });

                            }else{
                                if(!_.isEmpty(values)) {

                                    content=JSON.parse(JSON.stringify(content));

                                    tokenTypes.create({name:content.name,type:"app"}, function (err, data) {

                                        if (err) {
                                            return res.status(500).send({
                                                error: "delete_error",
                                                error_message: 'token type ' + content.name + ' is deleted but some rule with this token type could be exist'
                                            });
                                        } else {
                                            return res.status(409).send({
                                                error: "Warning",
                                                error_message: 'token type ' + content.name + ' is not deleted due some rule with this token type could be exist'
                                            });
                                        }
                                    });
                                }else{
                                    commonfunctions.updateUsers(function(){ //update microservice List
                                        return res.status(200).send(content);
                                    });
                                }
                            }
                        });
                    }
                }
            });

        }else{
            return res.status(404).send({error:"NotFoud", error_message:"no users type with this Id"});
        }

    });

});



/**
 * @api {put} /usertypes/:id update user type info
 * @apiVersion 1.0.0
 * @apiName UpdateUserType
 * @apiGroup UserType
 *
 * @apiDescription Accessible only by microservice access_token, It update user type info and return the updated resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the user type id to identify it.
 * @apiParam {Object} usertype the user type dictionary with all updatable fields described below.
 * @apiParam {Object} usertype.name the user type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 PUT request
 *  Body:{ "usertype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (200 - OK) {String} _id Contains id of updated user type
 * @apiSuccess (200 - OK) {String} name Contains name of updated user type
 * @apiSuccess (200 - OK) {String} type  Contains type of updated user type. must be equal to "user"
 *
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 200 OK
 *
 *     {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"user",
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse Conflict
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.put('/:id',jwtMiddle.ensureIsMicroservice, function (req, res) {

    var id = req.param('id').toString();

    if(!req.body) return res.status(400).send({error:"BadREquest",error_message:'request body missing'});

    var update=req.body.usertype || null;

    if (!update){
        return res.status(400).send({error: 'BadRequest', error_message : "No usertype provided"});
    }


    tokenTypes.findByIdAndUpdate(id,update,function(err,content){
        if(err) return res.status(500).send({error: "update_internal_error",error_message: 'Unable to update user token type (err:' + err + ')'});

        if(content) {

            commonfunctions.updateUsers(function () { //update microservice List
                async.parallel([
                    function(clbP){
                        Users.update({type: content.name}, {type: update.name}, function (err, values) {
                            if (err) {
                                clbP("err",null);

                            } else {
                                clbP(null,"one");
                            }
                        });
                    },
                    function(clbP){
                        authorization.update({authToken:content.name},{$set : { "authToken.$" :update.name } },{upsert:false,multi:true},function(err,updatevalues){
                            if(err){
                                clbP("err",null);
                            }else{
                                clbP(null,"two");
                            }
                        });
                    }
                ],function(err,resultsP){
                    if(err){
                        return res.status(409).send({
                            error: "warning",
                            error_message: 'token type ' + content.name + ' is updated but some users of this type could be exist)'
                        });
                    }else{
                        // content is old value so to return the new must be updated
                        for(var key in tokenTypesSchema.paths){
                            if(_.isUndefined(update[key]))
                                update[key]=content[key];
                        }

                        return res.status(200).send(update);
                    }
                });
            });
        }else{
            return res.status(404).send({error:"NotFoud", error_message:"no user type with this Id"});
        }

    });

});



/**
 * @api {post} /usertypes Create a new user type
 * @apiVersion 1.0.0
 * @apiName CreateUserType
 * @apiGroup UserType
 *
 * @apiDescription Accessible only by microservice access_token, It create a new user type and return the created resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {Object} body.usertype the user type dictionary with all the fields,  name field is mandatory.
 * @apiParam {Object} body.usertype.name the application identifier type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "usertype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (201 - OK) {String} _id Contains id of created user type
 * @apiSuccess (201 - OK) {String} name Contains name of created user type
 * @apiSuccess (201 - OK) {String} type  Contains type of created user type. must be equal to "user"
 *
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"user",
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.post('/',jwtMiddle.ensureIsMicroservice, function (req, res) {


    if(!req.body) return res.status(400).send({error:"BadREquest",error_message:'request body missing'});

    var cont=req.body.usertype || null;


    if (!cont){
        return res.status(400).send({error: 'BadRequest', error_message : "No usertype provided"});
    }

    cont.type="user";

    try{
        tokenTypes.findOne(cont,function(err,valFined){
           if(err) return res.status(500).send({error: "internal_error",error_message: 'Unable to create user token type (err:' + err + ')'});
           if(_.isEmpty(valFined)){
               tokenTypes.create(cont,function(err,content){
                   if(err) return res.status(500).send({error: "internal_error",error_message: 'Unable to create user token type (err:' + err + ')'});

                   commonfunctions.updateUsers(function(){ //update microservice List
                       return res.status(201).send(content);
                   });


               });
           } else{
               return res.status(409).send({error: "Conflict",error_message: 'this User Type Already exixt'});
           }
        });

    }catch (e){
        return res.status(500).send({error: "internal_error",error_message: 'Unable to create user token type (err:' + e + ')'});
    }


});

module.exports = router;
