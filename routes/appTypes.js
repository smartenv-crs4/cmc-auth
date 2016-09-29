var express = require('express');
var router = express.Router();
var tokenTypes = require('../models/userAndAppTypes').UserAndAppTypes;
var tokenTypesSchema = require('../models/userAndAppTypes').UserAndAppTypesSchema;
var Apps = require('../models/apps').Apps;
var authorization = require('../models/authEndpoints').AuthEndPoint;
var jwtMiddle = require('./jwtauth');
var commonfunctions=require('./commonfunctions');
var conf=require('./configSettingManagment');
var util=require('util');
var _=require('underscore');
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
 * @apiSuccess {Object[]} userandapptypes a paginated array list of application type objects
 * @apiSuccess {String} userandapptypes.id application id identifier
 * @apiSuccess {String} userandapptypes.name name of application type
 * @apiSuccess {String} userandapptypes.type type class of token. must be equal to string "app".
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
 *                           "type": "app",
 *
 *                      },
 *                      {
 *                       "id": "543fdd60579e1281sdaf6da92",
 *                          "name": "developer",
 *                          "type": "app",
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
 * @api {get} /apptypes Get all application type
 * @apiVersion 1.0.0
 * @apiName Application type list
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by other microservice access_token. It return a paginated list of all available application types.
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

    query.type="app";

    tokenTypes.findAll(query, req.dbQueryFields ,req.dbPagination, function(err, results){

        if(!err){

            if (!_.isEmpty(results.userandapptypes))
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
 * @api {get} /apptypes/:id Get application type by Id
 * @apiVersion 1.0.0
 * @apiName Get Application type info
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by other microservice access_token. given a determinate Id, It return application type info.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 * @apiParam {String} id the Application type id to identify it.
 *
 *
 * @apiSuccess {String} _id Application type id identifier
 * @apiSuccess {String} name application type name
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
        if(err) return res.status(500).send({error: "Internal Error",error_message: 'Unable to read app token types(err:' + err + ')'});



        if(!content)
            return res.status(404).send({error:"NotFoud", error_message:"no app type with this Id"});
        else{
            delete content['type'];
            return res.status(200).send(content);
        }


    });

});


/**
 * @api {delete} /apptypes/:id delete application type
 * @apiVersion 1.0.0
 * @apiName Delete Application Type
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access_token, It delete Application type and return the deleted resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ as query param || header]
 * @apiParam {String} id the Application id to identify the Application type
 *
 *
 *
 * @apiSuccess (200 - NoContent) {String} _id Application type id identifier
 * @apiSuccess (200 - NoContent) {String} name application type name
 *
 *
 * @apiSuccessExample {json} Example: 200 DELETED
 *      HTTP/1.1 200 NoContent
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
        if(err) return res.status(500).send({error: "delete_error",error_message: 'Unable to delete app token type (err:' + err + ')'});

        if(content){
            Apps.find({type:content.name},function (err,values) {
                if(err){
                    tokenTypes.create(content,function(err,data){
                        if(err){
                            return res.status(500).send({error: "delete_error",error_message: 'token type ' + content.name + ' is deleted but some app of this type could be exist'});
                        } else{
                            return res.status(409).send({error: "Warning",error_message: 'token type ' + content.name + ' is not deleted due some app of this type could be exist'});
                        }
                    });

                }else{
                    if(!_.isEmpty(values)) {

                        content=JSON.parse(JSON.stringify(content));

                        tokenTypes.create({name:content.name,type:"app"}, function (err, data) {

                            if (err) {
                                return res.status(500).send({
                                    error: "delete_error",
                                    error_message: 'token type ' + content.name + ' is deleted but some app of this type could be exist'
                                });
                            } else {
                                return res.status(409).send({
                                    error: "Warning",
                                    error_message: 'token type ' + content.name + ' is not deleted due some app of this type could be exist'
                                });
                            }
                        });
                    }else{

                        authorization.find({authToken:content.name},function (err,values) {
                            if(err){
                                tokenTypes.create(content,function(err,data){
                                    if(err){
                                        return res.status(500).send({error: "delete_error",error_message: 'token type ' + content.name + ' is deleted but some app of this type could be exist'});
                                    } else{
                                        return res.status(409).send({error: "Warning",error_message: 'token type ' + content.name + ' is not deleted due some app of this type could be exist'});
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
                                    commonfunctions.updateApp(function(){ //update microservice List
                                        return res.status(200).send(content);
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }else{
            return res.status(404).send({error:"NotFoud", error_message:"no aplication type with this Id"});
        }
    });

});



/**
 * @api {put} /apptypes/:id update application type info
 * @apiVersion 1.0.0
 * @apiName Update application
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access_token, It update Application type info and return the updated resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {String} id the Application type id to identify it.
 * @apiParam {Object} apptype the application type dictionary with all the fields to update.
 * @apiParam {Object} apptype.name the application identifier type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 PUT request
 *  Body:{ "apptype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (200 - OK) {String} _id Contains id of updated application type
 * @apiSuccess (200 - OK) {String} name Contains name of updated application type
 * @apiSuccess (200 - OK) {String} type  Contains type of updated application type. must be equal to "app"
 *
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 200 OK
 *
 *     {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"app",
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

    var update=req.body.apptype || null;

    if (!update){
        return res.status(400).send({error: 'BadRequest', error_message : "No apptype provided"});
    }


    tokenTypes.findByIdAndUpdate(id,update,function(err,content){
        if(err) return res.status(500).send({error: "update_internal_error",error_message: 'Unable to update app token type (err:' + err + ')'});

        if(content) {

            commonfunctions.updateApp(function () { //update application token types list in schema


                async.parallel([
                    function(clbP){
                        Apps.update({type: content.name}, {type: update.name}, function (err, values) {
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
                            error_message: 'token type ' + content.name + ' is updated but some app of this type could be exist)'
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
            return res.status(404).send({error:"NotFoud", error_message:"no aplication type with this Id"});
        }
    });

});



/**
 * @api {post} /apptypes Create a new application type
 * @apiVersion 1.0.0
 * @apiName Create new application type
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access_token, It create a new Application type and return the created resource.
 *
 *
 * @apiParam {String} access_token access_token to access to this resource. it must be sended in [ body || as query param || header]
 * @apiParam {Object} apptype the application type dictionary with all the fields,  name field is mandatory.
 * @apiParam {Object} apptype.name the application identifier type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "apptype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (201 - OK) {String} _id Contains id of created application type
 * @apiSuccess (201 - OK) {String} name Contains name of created application type
 * @apiSuccess (201 - OK) {String} type  Contains type of created application type. must be equal to "app"
 *
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 201 CREATED
 *
 *     {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"app",
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 *
 */
router.post('/',jwtMiddle.ensureIsMicroservice, function (req, res) {


    if(!req.body) return res.status(400).send({error:"BadREquest",error_message:'request body missing'});

    var cont=req.body.apptype || null;

    if (!cont){
        return res.status(400).send({error: 'BadRequest', error_message : "No apptype provided"});
    }

    cont.type="app";

   
    try{
        tokenTypes.findOne(cont,function(err,valFined){
            if(err) return res.status(500).send({error: "internal_error",error_message: 'Unable to create user token type (err:' + err + ')'});
            if(_.isEmpty(valFined)){
                tokenTypes.create(cont,function(err,content){
                    if(err) return res.status(500).send({error: "internal_error",error_message: 'Unable to create app token type (err:' + err + ')'});

                    commonfunctions.updateApp(function(){ //update microservice List
                        return res.status(201).send(content);
                    });
                });
            } else{
                return res.status(409).send({error: "Conflict",error_message: 'this App Type Already exixt'});
            }
        });

    }catch (e){
        return res.status(500).send({error: "internal_error",error_message: 'Unable to create app token type (err:' + e + ')'});
    }





});

module.exports = router;
