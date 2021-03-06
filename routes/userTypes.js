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
var tokenTypes = require('../models/userAndAppTypes').UserAndAppTypes;
var tokenTypesSchema = require('../models/userAndAppTypes').UserAndAppTypesSchema;
var authorization = require('../models/authEndpoints').AuthEndPoint;
var Users = require('../models/users').User;
var jwtMiddle = require('./jwtauth');
var commonfunctions=require('./commonfunctions');
var util=require('util');
var _= require('underscore');
var middlewares=require('./middlewares');
var async=require('async');

router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);



/**
 * @api {get} /usertypes Get all User Token Types
 * @apiVersion 1.0.0
 * @apiName GetAllUserTypes
 * @apiGroup User Type
 *
 * @apiDescription Protected by access token, returns a paginated list of all available user token types.<BR>
 * Set pagination skip and limit and other filters in the URL request, e.g. "get /authuser?skip=10&limit=50&field=value"
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
 * @apiUse GetUserTypeResource
 * @apiUse GetUserTypeResourceExample
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse NoContent
 * @apiUse ServerError
 */
router.get('/', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var query = {};

    for (var v in req.query)
        if (tokenTypes.schema.path(v))
            query[v] = req.query[v];

    query.type = "user";

    tokenTypes.findAll(query, req.dbQueryFields, req.dbPagination, function (err, usertypeslist) {

        if (!err) {
            if (!_.isEmpty(usertypeslist.userandapptypes))
                return res.status(200).send(usertypeslist);
            else
                return res.status(204).send(null);
        }
        else {
            return res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });

});



/**
 * @api {get} /usertypes/:id Get User Token Type by Id
 * @apiVersion 1.0.0
 * @apiName GetUserTypeById
 * @apiGroup User Type
 *
 * @apiDescription Protected by access token, returns the user token type dictionary.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    User token type id
 *
 * @apiSuccess {String} _id     User token type id
 * @apiSuccess {String} name    User type name
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *
 *        "_id": "543fdd60579e1281b8f6da92",
 *        "name": "externalWebUi"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.get('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    tokenTypes.findById(id, function (err, content) {
        if (err) return res.status(500).send({
            error: "Internal Eroor",
            error_message: 'Unable to read user token types(err:' + err + ')'
        });

        if (!content)
            return res.status(204).send({error: "NotFoud", error_message: "no users type with this Id"});
        else {
            delete content['type'];
            return res.status(200).send(content);
        }
    });

});



/**
 * @api {delete} /usertypes/:id Delete User Type
 * @apiVersion 1.0.0
 * @apiName DeleteUserType
 * @apiGroup User Type
 *
 * @apiDescription Protected by access token, deletes user token type and returns the deleted resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id    User token type id
 *
 * @apiSuccess (200 - OK) {String} _id      user token type id
 * @apiSuccess (200 - OK) {String} name     user type name
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 200 Ok
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
 * @apiSampleRequest off
 */
router.delete('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    tokenTypes.findByIdAndRemove(id, function (err, content) {
        if (err) return res.status(500).send({
            error: "delete_error",
            error_message: 'Unable to delete user token type (err:' + err + ')'
        });

        if (content) {
            content = JSON.parse(JSON.stringify(content));
            Users.find({type: content.name}, function (err, values) {
                if (err) {
                    tokenTypes.create(content, function (err, data) {
                        if (err) {
                            return res.status(500).send({
                                error: "delete_error",
                                error_message: 'token type ' + content.name + ' is deleted but some user of this type could be exist)'
                            });
                        } else {
                            return res.status(409).send({
                                error: "Warning",
                                error_message: 'token type ' + content.name + ' is not deleted due some user of this type could be exist)'
                            });
                        }
                    });
                } else {
                    if (!_.isEmpty(values)) {

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
                    } else {
                        authorization.find({authToken: content.name}, function (err, values) {
                            if (err) {
                                tokenTypes.create(content, function (err, data) {
                                    if (err) {
                                        return res.status(500).send({
                                            error: "delete_error",
                                            error_message: 'token type ' + content.name + ' is deleted but some rules with this token type could exist'
                                        });
                                    } else {
                                        return res.status(409).send({
                                            error: "Warning",
                                            error_message: 'token type ' + content.name + ' is not deleted due to some rules with this token type could exist'
                                        });
                                    }
                                });
                            } else {
                                if (!_.isEmpty(values)) {
                                    tokenTypes.create(content, function (err, data) {

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
                                    commonfunctions.updateUsers(function () { //update microservice List
                                        return res.status(200).send(content);
                                    });
                                }
                            }
                        });
                    }
                }
            });
        } else {
            return res.status(204).send({error: "NotFoud", error_message: "no users type with this Id"});
        }
    });

});



/**
 * @api {put} /usertypes/:id Update User Type info
 * @apiVersion 1.0.0
 * @apiName UpdateUserType
 * @apiGroup User Type
 *
 * @apiDescription Protected by access token, updates the user token type info and returns the updated resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter)    {String} id             User token type id
 * @apiParam (Body parameter)   {Object} usertype User  Token type dictionary with all the updatable fields
 * @apiParam (Body parameter)   {String} usertype.name  User token type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 PUT request
 *  Body:{ "usertype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (200 - OK) {String} _id      id of the updated user token type
 * @apiSuccess (200 - OK) {String} name     name of the updated user token type
 * @apiSuccess (200 - OK) {String} type     type of the updated user token type. Must be equal to "user"
 *
 * @apiSuccessExample {json} Example: 200 Ok
 *      HTTP/1.1 200 OK
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
 * @apiSampleRequest off
 */
router.put('/:id', jwtMiddle.ensureIsAuthorized, function (req, res) {

    var id = (req.params.id).toString();

    if (!req.body) return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});

    var update = req.body.usertype || null;

    if (!update) {
        return res.status(400).send({error: 'BadRequest', error_message: "No usertype provided"});
    }

    tokenTypes.findByIdAndUpdate(id, update, function (err, content) {
        if (err) return res.status(500).send({
            error: "update_internal_error",
            error_message: 'Unable to update user token type (err:' + err + ')'
        });

        if (content) {
            commonfunctions.updateUsers(function () { //update microservice List
                async.parallel([
                    function (clbP) {
                        Users.update({type: content.name}, {type: update.name}, function (err, values) {
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
                            error_message: 'token type ' + content.name + ' is updated but some users of this type could exist)'
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
            return res.status(204).send({error: "NotFoud", error_message: "no user type with this Id"});
        }
    });

});



/**
 * @api {post} /usertypes Create a new User Token Type
 * @apiVersion 1.0.0
 * @apiName CreateUserType
 * @apiGroup User Type
 *
 * @apiDescription Protected by access token, creates a new user token type and returns the created resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 *
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {Object} body.usertype        User type dictionary with all the fields.
 * @apiParam (Body parameter) {Object} body.usertype.name   User type name
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "usertype": {"name":"ExternalWebUi"}}
 *
 * @apiSuccess (201 - OK) {String} _id      id of the created user type
 * @apiSuccess (201 - OK) {String} name     name of the created user type
 * @apiSuccess (201 - OK) {String} type     type of the created user type. Must be equal to "user"
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *      {
 *        "_id":"9804H4334HFN",
 *        "name":"ExternaWebUi",
 *        "type":"user",
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 *
 */
router.post('/', jwtMiddle.ensureIsAuthorized, function (req, res) {

    if (!req.body) return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});

    var cont = req.body.usertype || null;

    if (!cont) {
        return res.status(400).send({error: 'BadRequest', error_message: "Query field “usertype” is mandatory in the request"});
    }
    cont.type = "user";

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
                        error_message: 'Unable to create user token type (err:' + err + ')'
                    });
                    commonfunctions.updateUsers(function () { //update microservice List
                        return res.status(201).send(content);
                    });
                });
            } else {
                return res.status(409).send({error: "Conflict", error_message: 'this User Type:' + cont.name + '  Already exist'});
            }
        });
    } catch (e) {
        return res.status(500).send({
            error: "internal_error",
            error_message: 'Unable to create user token type (err:' + e + ')'
        });
    }

});

module.exports = router;