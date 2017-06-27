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

var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("./dbTest");
var Apps = require('../models/apps').Apps;
var Users = require('../models/users').User;
var conf = require('../config').conf;
var moment = require('moment');
var jwt = require('jwt-simple');
var request = require('request');
var app = require('../app');
var util = require('util');
var Port = 3055;
var APIURL = 'http://localhost:' + Port;
var server;
var type = conf.userType;
var appType=conf.appType;

describe('AuthMS API', function () {

    before(function (done) {
        db.connect("AuthMs-api",function (err) {
            if (err) console.log("######   ERRORE BEFORE : " + err +"  ######");

            app.set('port', process.env.PORT || Port);

            server = app.listen(app.get('port'), function () {
                console.log('TEST Express server listening on port ' + server.address().port);
                done();
            });
        });
    });

    after(function (done) {
        Apps.remove({}, function (err,elm) {
            if (err) console.log("######   ERRORE After: " + err +"  ######");
            Users.remove({}, function (err,elm) {
                if (err) console.log("######   ERRORE After " + err +"  ######");
                db.disconnect(function (err,res) {
                    if (err) console.log("######   ERRORE After: " + err +"  ######");
                    done();
                });
                server.close();
            });
        });
    });


    beforeEach(function (done) {

       done();
    });


    afterEach(function (done) {
        Apps.remove({}, function (err, elm) {
            if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
            Users.remove({}, function (err, elm) {
                if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
                done();
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should create a new Application and call Decode Token', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response,body) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    //appBody=JSON.stringify({decode_token:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken?decode_token="+ results.apiKey.token;
                    request.get({
                        url: url,
                        //body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('token');
                            results.valid.should.be.true;
                            results.token._id.should.be.equal(userId);
                            results.token.email.should.be.equal(user.email);
                            results.token.type.should.be.equal(user.type);
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should create a new Application and call Decode Token with post', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('token');
                            results.valid.should.be.true;
                            results.token._id.should.be.equal(userId);
                            results.token.email.should.be.equal(user.email);
                            results.token.type.should.be.equal(user.type);
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should not Decode Token due not decode_token provided(no body sended)', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        //body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is required");
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not Decode Token due not decode_token provided', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_tokens:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is required");
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /refreshToken', function () {

        it('should not refresh Token due not refresh_token provided', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_tokens:results.apiKey.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(207);
                            var results = JSON.parse(response.body);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("The refresh_token is required");
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not Decode Token due bad decode_token provided', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token+"AA"});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is invalid or malformed");
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /refreshToken', function () {

        it('should not refresh Token due bad refresh_token provided', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token+"AA"});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(207);
                            var results = JSON.parse(response.body);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("The refresh_token is invalid or malformed");
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /refreshToken', function () {

        it('should not refresh Token due Ms token', function (done) {
            appBody=JSON.stringify({decode_token:conf.MyMicroserviceToken});

            url= APIURL + "/tokenactions/refreshToken";
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response,body) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {

                    response.statusCode.should.be.equal(401);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("Can not refresh this token Type");
                }
                done();
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should not Decode Token due expiredToken', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token+"AA"});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is invalid or malformed");
                        }
                        done();
                    });
                }
            });
        });
    });



    function generateToken(resource,mode){
        "use strict";
        var expires = moment().add(-10, 'days').valueOf();
        var secret = require('../app').get('jwtTokenSecret');

        var token = jwt.encode({
            mode:mode,
            iss: resource._id,
            email: resource.email,
            type: resource.type,
            enabled: resource.enabled,
            exp: expires
        }, secret);

        var expiresRt = moment().add(-8, 'days').valueOf();
        var refreshToken = jwt.encode({
            mode:mode,
            iss: resource._id,
            email: resource.email,
            type: resource.type,
            enabled: resource.enabled,
            exp: expiresRt
        }, secret);

        var encodedToken = JSON.stringify({
            apiKey : { token:token, expires: expires},
            refreshToken : {token:refreshToken, expires: expiresRt},
            userId : resource._id
        });
        return encodedToken;
    };


    describe('POST /decodeToken', function () {

        it('should not decode Token due expired token', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});

            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE 522 should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var oldtoken=results.apiKey.token;
                    var oldRefreskT=results.refreshToken.token;
                    var userId=results.userId;

                    appBody=JSON.stringify({refresh_token:results.refreshToken.token});


                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE 588 should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                            results.apiKey.token.should.be.not.equal(oldtoken);
                            results.refreshToken.token.should.be.not.equal(oldRefreskT);

                            appBody=JSON.stringify({decode_token:results.apiKey.token});

                            url= APIURL + "/tokenactions/decodeToken";
                            request.post({
                                url: url,
                                body: appBody,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            }, function (error, response) {
                                if (error) console.log("######   ERRORE  605 should create a new Application: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(200);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('valid');
                                    results.should.have.property('token');
                                    results.valid.should.be.true;
                                    results.token._id.should.be.equal(userId);
                                    results.token.email.should.be.equal(user.email);
                                    results.token.type.should.be.equal(user.type);

                                    var expiredToken=JSON.parse(generateToken(results.token,results.token.mode));

                                    appBody=JSON.stringify({decode_token:expiredToken.apiKey.token});
                                    url= APIURL + "/tokenactions/decodeToken";
                                    request.post({
                                        url: url,
                                        body: appBody,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######   ERRORE 626 should create a new Application: " + error +"  ######");
                                        else {
                                            response.statusCode.should.be.equal(401);
                                            var results = JSON.parse(response.body);
                                            results.should.have.property('valid');
                                            results.should.have.property('error_message');
                                            results.valid.should.be.false;
                                            results.error_message.should.be.equal("The decode_token is expired");
                                        }
                                        done();
                                    });
                                }

                            });
                        }
                    });
                }
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should not decode Token due not user associated', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE 665 should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var oldtoken=results.apiKey.token;
                    var oldRefreskT=results.refreshToken.token;
                    var userId=results.userId;

                    appBody=JSON.stringify({refresh_token:results.refreshToken.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE  683 should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                            results.apiKey.token.should.be.not.equal(oldtoken);
                            results.refreshToken.token.should.be.not.equal(oldRefreskT);


                            Users.findByIdAndRemove(results.userId,function(error,usr){
                                if (error) console.log("######   ERRORE 694 should create a new Application: " + error +"  ######");

                                appBody=JSON.stringify({decode_token:results.apiKey.token});
                                url= APIURL + "/tokenactions/decodeToken";
                                request.post({
                                    url: url,
                                    body: appBody,
                                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                }, function (error, response) {
                                    if (error) console.log("######   ERRORE 706 should create a new Application: " + error +"  ######");
                                    else {
                                        response.statusCode.should.be.equal(401);
                                        var results = JSON.parse(response.body);
                                        results.should.have.property('valid');
                                        results.should.have.property('error_message');
                                        results.valid.should.be.false;
                                        results.error_message.should.be.equal("The decode_token is not associated to any user");
                                    }
                                    done();
                                });

                            });
                        }
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not decode Token due not enabled user ', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({user:user});
            var url = APIURL + '/authuser/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var oldtoken=results.apiKey.token;
                    var oldRefreskT=results.refreshToken.token;
                    var userId=results.userId;

                    appBody=JSON.stringify({refresh_token:results.refreshToken.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                            results.apiKey.token.should.be.not.equal(oldtoken);
                            results.refreshToken.token.should.be.not.equal(oldRefreskT);


                            Users.findByIdAndUpdate(results.userId,{enabled:false},function(error,usr){
                                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");

                                appBody=JSON.stringify({decode_token:results.apiKey.token});
                                url= APIURL + "/tokenactions/decodeToken";
                                request.post({
                                    url: url,
                                    body: appBody,
                                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                }, function (error, response) {
                                    if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                                    else {
                                        response.statusCode.should.be.equal(401);
                                        var results = JSON.parse(response.body);
                                        results.should.have.property('valid');
                                        results.should.have.property('error_message');
                                        results.valid.should.be.false;
                                        results.error_message.should.be.equal("The decode_token is associated to unchecked or not enabled user");
                                    }
                                    done();
                                });

                            });
                        }
                    });
                }
            });
        });
    });



    ///////////////////////////

    describe('POST /decodeToken', function () {

        it('should create a new Application and call Decode Token', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    //appBody=JSON.stringify({decode_token:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken?decode_token="+ results.apiKey.token;
                    request.get({
                        url: url,
                        //body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('token');
                            results.valid.should.be.true;
                            results.token._id.should.be.equal(userId);
                            results.token.email.should.be.equal(user.email);
                            results.token.type.should.be.equal(user.type);
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should create a new Application and call Decode Token with post', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('token');
                            results.valid.should.be.true;
                            results.token._id.should.be.equal(userId);
                            results.token.email.should.be.equal(user.email);
                            results.token.type.should.be.equal(user.type);
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should not Decode Token due not decode_token provided(no body sended)', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        //body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is required");
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not Decode Token due not decode_token provided', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_tokens:results.apiKey.token});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is required");
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /refreshToken', function () {

        it('should not refresh Token due not refresh_token provided', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_tokens:results.apiKey.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(207);
                            var results = JSON.parse(response.body);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("The refresh_token is required");
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not Decode Token due bad decode_token provided', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token+"AA"});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is invalid or malformed");
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /refreshToken', function () {

        it('should not refresh Token due bad refresh_token provided', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token+"AA"});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(207);
                            var results = JSON.parse(response.body);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("The refresh_token is invalid or malformed");
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /refreshToken', function () {

        it('should not refresh Token due Ms token', function (done) {
            appBody=JSON.stringify({decode_token:conf.MyMicroserviceToken});

            url= APIURL + "/tokenactions/refreshToken";
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response,body) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {

                    response.statusCode.should.be.equal(401);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("Can not refresh this token Type");
                }
                done();
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should not Decode Token due expiredToken', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var userId=results.userId;

                    appBody=JSON.stringify({decode_token:results.apiKey.token+"AA"});

                    url= APIURL + "/tokenactions/decodeToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(response.body);
                            results.should.have.property('valid');
                            results.should.have.property('error_message');
                            results.valid.should.be.false;
                            results.error_message.should.be.equal("The decode_token is invalid or malformed");
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not decode Token due expired token', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';

            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE 1260 should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var oldtoken=results.apiKey.token;
                    var oldRefreskT=results.refreshToken.token;
                    var userId=results.userId;

                    appBody=JSON.stringify({refresh_token:results.refreshToken.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE  1278 should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                            results.apiKey.token.should.be.not.equal(oldtoken);
                            results.refreshToken.token.should.be.not.equal(oldRefreskT);

                            appBody=JSON.stringify({decode_token:results.apiKey.token});

                            url= APIURL + "/tokenactions/decodeToken";
                            request.post({
                                url: url,
                                body: appBody,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            }, function (error, response) {
                                if (error) console.log("######   ERRORE 1295 should create a new Application: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(200);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('valid');
                                    results.should.have.property('token');
                                    results.valid.should.be.true;
                                    results.token._id.should.be.equal(userId);
                                    results.token.email.should.be.equal(user.email);
                                    results.token.type.should.be.equal(user.type);

                                    var expiredToken=JSON.parse(generateToken(results.token,results.token.mode));

                                    appBody=JSON.stringify({decode_token:expiredToken.apiKey.token});
                                    url= APIURL + "/tokenactions/decodeToken";
                                    request.post({
                                        url: url,
                                        body: appBody,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######   ERRORE 1316 should create a new Application: " + error +"  ######");
                                        else {
                                            response.statusCode.should.be.equal(401);
                                            var results = JSON.parse(response.body);
                                            results.should.have.property('valid');
                                            results.should.have.property('error_message');
                                            results.valid.should.be.false;
                                            results.error_message.should.be.equal("The decode_token is expired");
                                        }
                                        done();
                                    });
                                }

                            });
                        }
                    });
                }
            });
        });
    });



    describe('POST /decodeToken', function () {

        it('should not decode Token due not user associated', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var oldtoken=results.apiKey.token;
                    var oldRefreskT=results.refreshToken.token;
                    var userId=results.userId;

                    appBody=JSON.stringify({refresh_token:results.refreshToken.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    //url= APIURL + "refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE 1373 should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                            results.apiKey.token.should.be.not.equal(oldtoken);
                            results.refreshToken.token.should.be.not.equal(oldRefreskT);


                            Apps.findByIdAndRemove(results.userId,function(error,usr){
                                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");

                                appBody=JSON.stringify({decode_token:results.apiKey.token});
                                url= APIURL + "/tokenactions/decodeToken";
                                request.post({
                                    url: url,
                                    body: appBody,
                                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                }, function (error, response) {
                                    if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                                    else {
                                        response.statusCode.should.be.equal(401);
                                        var results = JSON.parse(response.body);
                                        results.should.have.property('valid');
                                        results.should.have.property('error_message');
                                        results.valid.should.be.false;
                                        results.error_message.should.be.equal("The decode_token is not associated to any APP");
                                    }
                                    done();
                                });

                            });
                        }
                    });
                }
            });
        });
    });


    describe('POST /decodeToken', function () {

        it('should not decode Token due not enabled user ', function (done) {
            var user = {
                "type": appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/authapp/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');
                    var oldtoken=results.apiKey.token;
                    var oldRefreskT=results.refreshToken.token;
                    var userId=results.userId;

                    appBody=JSON.stringify({refresh_token:results.refreshToken.token});

                    url= APIURL + "/tokenactions/refreshToken";
                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                            results.apiKey.token.should.be.not.equal(oldtoken);
                            results.refreshToken.token.should.be.not.equal(oldRefreskT);


                            Apps.findByIdAndUpdate(results.userId,{enabled:false},function(error,usr){
                                if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");

                                appBody=JSON.stringify({decode_token:results.apiKey.token});
                                url= APIURL + "/tokenactions/decodeToken";
                                request.post({
                                    url: url,
                                    body: appBody,
                                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                }, function (error, response) {
                                    if (error) console.log("######   ERRORE should create a new Application: " + error +"  ######");
                                    else {
                                        response.statusCode.should.be.equal(401);
                                        var results = JSON.parse(response.body);
                                        results.should.have.property('valid');
                                        results.should.have.property('error_message');
                                        results.valid.should.be.false;
                                        results.error_message.should.be.equal("The decode_token is associated to unchecked or not enabled APP");
                                    }
                                    done();
                                });

                            });
                        }
                    });
                }
            });
        });
    });

    ///////////////////////////


});



