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







/**
 * @api {get} /apptypes Get all application types
 * @apiVersion 1.0.0
 * @apiName Application type list
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access tokens. Returns a paginated list of all available application types.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse NotFound
 * @apiUse ServerError
 */
router.get('/', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var query = {};

    for (var v in req.query)
        if (tokenTypes.schema.path(v))
            query[v] = req.query[v];

    query.type = "app";

    tokenTypes.findAll(query, req.dbQueryFields, req.dbPagination, function (err, results) {

        if (!err) {

            if (!_.isEmpty(results.userandapptypes))
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
 * @api {get} /apptypes/:id Get application type by Id
 * @apiVersion 1.0.0
 * @apiName Get Application type info
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access tokens. Given an Id, it returns the application type info.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} id the Application type id
 *
 * @apiSuccess {String} _id Application type identifier
 * @apiSuccess {String} name Application type name
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *        "_id": "543fdd60579e1281b8f6da92",
 *        "name": "externalWebUi"
 *     }
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    tokenTypes.findById(id, function (err, content) {
        if (err) return res.status(500).send({
            error: "Internal Error",
            error_message: 'Unable to read app token types(err:' + err + ')'
        });

        if (!content)
            return res.status(404).send({error: "NotFoud", error_message: "no app type with this Id"});
        else {
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
 * @apiDescription Accessible only by microservice access tokens. Deletes Application type and returns the deleted resource.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} id the Application type id
 *
 * @apiSuccess (200 - OK) {String} _id Application type identifier
 * @apiSuccess (200 - OK) {String} name Application type name
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "_id":"543fdd60579e1281b8f6da92",
 *        "name":"externalWebUi"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse Conflict
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.delete('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    tokenTypes.findByIdAndRemove(id, function (err, content) {
        if (err) return res.status(500).send({
            error: "delete_error",
            error_message: 'Unable to delete app token type (err:' + err + ')'
        });
        if (content) {
            Apps.find({type: content.name}, function (err, values) {
                if (err) {
                    tokenTypes.create(content, function (err, data) {
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
                } else {
                    if (!_.isEmpty(values)) {

                        content = JSON.parse(JSON.stringify(content));

                        tokenTypes.create({name: content.name, type: "app"}, function (err, data) {

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
                    } else {
                        authorization.find({authToken: content.name}, function (err, values) {
                            if (err) {
                                tokenTypes.create(content, function (err, data) {
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
                            } else {
                                if (!_.isEmpty(values)) {

                                    content = JSON.parse(JSON.stringify(content));

                                    tokenTypes.create({name: content.name, type: "app"}, function (err, data) {

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
                                } else {
                                    commonfunctions.updateApp(function () { //update microservice List
                                        return res.status(200).send(content);
                                    });
                                }
                            }
                        });
                    }
                }
            });
        } else {
            return res.status(404).send({error: "NotFoud", error_message: "no aplication type with this Id"});
        }
    });

});



/**
 * @api {put} /apptypes/:id update application type info
 * @apiVersion 1.0.0
 * @apiName Update application
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access tokens. Updates the Application type info and returns the updated resource.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {String} id Application type id
 * @apiParam {Object} apptype  Application type dictionary with all the fields to update.
 * @apiParam {Object} apptype.name Application type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 PUT request
 *  Body:{ "apptype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (200 - OK) {String} _id id of the updated application type
 * @apiSuccess (200 - OK) {String} name name of the updated application type
 * @apiSuccess (200 - OK) {String} type  type of the updated application type. Must be equal to "app"
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"app",
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse Conflict
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.put('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    if (!req.body) return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});

    var update = req.body.apptype || null;

    if (!update) {
        return res.status(400).send({error: 'BadRequest', error_message: "No apptype provided"});
    }

    tokenTypes.findByIdAndUpdate(id, update, function (err, content) {
        if (err) return res.status(500).send({
            error: "update_internal_error",
            error_message: 'Unable to update app token type (err:' + err + ')'
        });

        if (content) {
            commonfunctions.updateApp(function () { //update application token types list in schema
                async.parallel([
                    function (clbP) {
                        Apps.update({type: content.name}, {type: update.name}, function (err, values) {
                            if (err) {
                                clbP("err", null);

                            } else {
                                clbP(null, "one");
                            }
                        });
                    },
                    function (clbP) {
                        authorization.update({authToken: content.name}, {$set: {"authToken.$": update.name}}, {
                            upsert: false,
                            multi: true
                        }, function (err, updatevalues) {
                            if (err) {
                                clbP("err", null);
                            } else {
                                clbP(null, "two");
                            }
                        });
                    }
                ], function (err, resultsP) {
                    if (err) {
                        return res.status(409).send({
                            error: "warning",
                            error_message: 'token type ' + content.name + ' is updated but some app of this type could be exist)'
                        });
                    } else {
                        // content is old value so to return the new must be updated
                        for (var key in tokenTypesSchema.paths) {
                            if (_.isUndefined(update[key]))
                                update[key] = content[key];
                        }
                        return res.status(200).send(update);
                    }
                });
            });
        } else {
            return res.status(404).send({error: "NotFoud", error_message: "no aplication type with this Id"});
        }
    });

});



/**
 * @api {post} /apptypes Create a new application type
 * @apiVersion 1.0.0
 * @apiName Create new application type
 * @apiGroup AppType
 *
 * @apiDescription Accessible only by microservice access tokens. Creates a new Application type and returns the created resource.
 *
 * @apiParam {String} access_token token that grants access to this resource. It must be sent in [ body || as query param || header]
 * @apiParam {Object} apptype the application type dictionary with all the fields. Name is mandatory.
 * @apiParam {Object} apptype.name the application type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "apptype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (201 - CREATED) {String} _id id of the created application type
 * @apiSuccess (201 - CREATED) {String} name name the of created application type
 * @apiSuccess (201 - CREATED) {String} type  type of the created application type. Must be equal to "app"
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *      {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"app",
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.post('/', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body) return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});

    var cont = req.body.apptype || null;

    if (!cont) {
        return res.status(400).send({error: 'BadRequest', error_message: "No apptype provided"});
    }

    cont.type = "app";

    try {
        tokenTypes.findOne(cont, function (err, valFined) {
            if (err) return res.status(500).send({
                error: "internal_error",
                error_message: 'Unable to create user token type (err:' + err + ')'
            });
            if (_.isEmpty(valFined)) {
                tokenTypes.create(cont, function (err, content) {
                    if (err) return res.status(500).send({
                        error: "internal_error",
                        error_message: 'Unable to create app token type (err:' + err + ')'
                    });

                    commonfunctions.updateApp(function () { //update microservice List
                        return res.status(201).send(content);
                    });
                });
            } else {
                return res.status(409).send({error: "Conflict", error_message: 'this App Type:' + cont.name + ' Already exist'});
            }
        });
    } catch (e) {
        return res.status(500).send({
            error: "internal_error",
            error_message: 'Unable to create app token type (err:' + e + ')'
        });
    }

});


module.exports = router;