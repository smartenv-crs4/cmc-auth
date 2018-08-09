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
var conf = require('../config').conf;
var request = require('request');
var app = require('../app');
var util = require('util');
var Port = 3055;
var APIURL = 'http://localhost:' + Port + "/authapp";
var server;
var type = conf.testSettings.appType;
var clientApplication;



describe('Apps API', function () {

    before(function (done) {

        db.connect("apps-api",function (err) {
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
            if (err) console.log("######   ERRORE After 1: " + err +"  ######");
            db.disconnect(function (err,res) {
                if (err) console.log("######   ERRORE After 2: " + err +"  ######");
                done();
            });
            server.close();
        });
    });


    beforeEach(function (done) {

        var range = _.range(100);

        async.each(range, function (e, cb) {

            Apps.create({
                email: "email" + e + "@email.it",
                type: type[_.random(0, type.length - 1)]
            }, function (err, newuser) {
                if (err) console.log("######   ERRORE BEFOREEACH: " + err +"  ######");
                if(e==1) clientApplication=newuser._id;
                cb();
            });

        }, function (err) {
            done();
        });
    });


    afterEach(function (done) {
        Apps.remove({}, function (err, elm) {
            if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
            done();
        });
    });



    describe('POST /authapp/signin', function () {

        it('should not login a Application no body sended', function (done) {
            var user = {
                "type": "nonvalido", //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify(user);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                // body : appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error){
                    console.log("######   ERRORE should not login a Application no body sended: " + error +"  ######");
                }
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    //results.error_message.should.be.equal("No valid User Type provided");
                }
                done();
            });
        });
    });



    describe('POST /authapp/signin', function () {

        it('should not login a Application no username sended', function (done) {
            var user = {
                //"type": "nonvalido", //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify(user);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error)  console.log("######   ERRORE should not login a Application no username sended: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No username provided");
                }
                done();
            });
        });
    });





    describe('POST /authapp/signin', function () {

        it('should not login a Application no password sended', function (done) {
            var user = {
                //"type": "nonvalido", //client | admin
                "username": "mario@caport.com",
                //"password": "miciomicio"
            };
            var appBody = JSON.stringify(user);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should not login a Application no password sended: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No password provided");
                }
                done();
            });
        });
    });


    describe('POST /authapp/signin', function () {

        it('should not login a Application invalid username sended', function (done) {
            var user = {
                //"type": "nonvalido", //client | admin
                "username": "mario@caportcom",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify(user);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should not login a Application invalid username sended: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(403);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error.should.be.equal("authentication error");
                }
                done();
            });
        });
    });


    describe('POST /authapp/signin', function () {

        it('should login a Application', function (done) {

            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response,body) {
                if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');

                    var url = APIURL + '/signin';
                    var user = {
                        "username": "mario@caport.com",
                        "password": "miciomicio"
                    };
                    var appBody = JSON.stringify(user);

                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response,body) {
                        if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');
                        }
                        done();
                    });
                }

            });
        });
    });


    describe('POST /authapp/signin', function () {

        it('should not login a Application bad User', function (done) {


            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should not login a Application bad User: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');

                    var url = APIURL + '/signin';
                    var user = {
                        "username": "mario@caportcom",
                        "password": "miciomicio"
                    };
                    var appBody = JSON.stringify(user);

                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######  2 ERRORE should not login a Application bad User: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(403);
                            var results = JSON.parse(response.body);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                        }
                        done();
                    });
                }

            });
        });
    });



    describe('POST /authapp', function () {

        it('should create a new Application', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
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
                }
                done();
            });
        });
    });



    describe('POST /authapp/signin', function () {

        it('should not login a Application bad Password', function (done) {


            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');

                    var url = APIURL + '/signin';
                    var user = {
                        "username": "mario@caport.com",
                        "password": "miciomici"
                    };
                    var appBody = JSON.stringify(user);

                    request.post({
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######   ERRORE: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(403);
                            var results = JSON.parse(response.body);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                        }
                        done();
                    });
                }
            });
        });
    });


    describe('POST /authapp', function () {

        it('should not create a new Application no body sended', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                //body : appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });


    describe('POST /authapp', function () {

        it('should not create a new Application no email sended', function (done) {
            var user = {
                "type": type[1], //client | admin
                //"email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            //("BODY " + appBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No email username provided");
                }
                done();
            });
        });
    });


    describe('POST /authapp', function () {

        it('should not create a new Application no User type sended', function (done) {
            var user = {
                //"type": conf.testSettings.appType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No type provided");
                }
                done();
            });
        });
    });




    describe('POST /authapp', function () {

        it('should not create a new Application no Password type sended', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                //"password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No password provided");
                }
                done();
            });
        });
    });



    describe('GET /authapp', function () {

        it('must return ONE user and _metadata, all fields', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=1',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);

                    results.should.have.property('_metadata');
                    results.should.have.property('apps');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(1);
                    results._metadata.totalCount.should.be.equal(100);
                    //should.exist(results.users[0].hash);
                    //should.exist(results.users[0].salt);
                    should.exist(results.apps[0].email);
                    should.exist(results.apps[0].type);
                    should.exist(results.apps[0].enabled);
                }
                done();
            });

        });

    });






    describe('GET /authapp', function () {

        it('must return 2 users and _metadata, all fields', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);
                    results.should.have.property('_metadata');
                    results.should.have.property('apps');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(2);
                    results._metadata.totalCount.should.be.equal(100);
                    should.exist(results.apps[0].email);
                    should.exist(results.apps[0].type);
                    should.exist(results.apps[0].enabled);
                }
                done();
            });
        });
    });






    describe('GET /authapp', function () {

        it('must return  error 400 for invalid conf.MyMicroserviceToken', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken + "d"}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    response.statusCode.should.be.equal(400);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });




    describe('GET /authapp', function () {

        it('must return  no error for invalid field', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2&fields=type,codFisc',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);
                    results.should.have.property('_metadata');
                    results.should.have.property('apps');
                    should.not.exist(results.apps[0].email);
                    should.exist(results.apps[0].type);
                    should.not.exist(results.apps[0].codFisc);
                    should.not.exist(results.apps[0].salt);
                }
                done();
            });
        });
    });


    describe('GET /authapp', function () {

        it('must return  error 400 for Access_token required', function (done) {

            request.get({url: APIURL + '?skip=0&limit=2'}, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    response.statusCode.should.be.equal(400);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });


    describe('POST /authapp', function () {
        this.timeout(10000);

        it('should not create a new Application no valid User type sended', function (done) {
            var user = {
                "type": "nonvalido", //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No valid App Type provided");
                }

                done();
            });
        });

    });



    describe('POST /authapp', function () {
        this.timeout(10000);

        it('should not create a new Application no valid field sended', function (done) {

            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio",
                "cofdFisc":"ABAA"
            };
            var appBody = JSON.stringify({app:user});

            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response,body) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(500);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.indexOf("Unable to register app").should.be.greaterThan(-1);
                }
                done();
            });
        });

    });


    describe('GET /authapp', function () {
        this.timeout(10000);

        try {
            it('must return  error 401 for Unauthorized token', function (done) {
                var user = {
                    "type": type[1], //client | admin
                    "email": "mario@caport.com",
                    "password": "miciomicio"
                };
                var appBody = JSON.stringify({app:user});
                var url = APIURL + '/signup';
                var results;

                request.post({
                    url: url,
                    body: appBody,
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                }, function (error, response,body) {
                    if (error) console.log("######   ERRORE 401 1: " + error + "  ######");
                    else {
                        response.statusCode.should.be.equal(201);
                        results = JSON.parse(response.body);
                        results.should.have.property('apiKey');
                        results.should.have.property('refreshToken');
                    }

                    request.get({
                        url: APIURL + '?skip=0&limit=2',
                        headers: {'Authorization': "Bearer " + results.apiKey.token}
                    }, function (error, response, body) {

                        if (error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else {

                            results = JSON.parse(body);
                            response.statusCode.should.be.equal(401);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("The access token is not a valid microservice Token");
                        }
                        done();
                    });
                });

            });
        }catch (err){
             console.log("catch " + err);

        }
    });



    describe('GET /authapp/:id', function(){

        it('must return a user by id, all fields', function(done){

            var url = APIURL+'/'+clientApplication;
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{

                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(response.body);
                    results.should.have.property('email');
                    results.should.have.property('type');
                    results.should.have.property('enabled');
                    results.should.not.have.property('salt');
                }
                done();
            });
        });
    });



    describe('GET /authapp/:id', function(){

        it('must return a user by id, fields type', function(done){

            var url = APIURL+'/'+clientApplication+"?fields=type";
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{

                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(response.body);
                    results.should.not.have.property('email');
                    results.should.have.property('type');
                    results.should.not.have.property('enabled');
                    results.should.not.have.property('salt');
                }
                done();
            });
        });
    });



    describe('GET /authapp/:id', function(){

        it('must return a user by id, send an invalid field', function(done){

            var url = APIURL+'/'+clientApplication+"?fields=type,codfiscale";
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{

                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(response.body);
                    results.should.not.have.property('email');
                    results.should.have.property('type');
                    results.should.not.have.property('enabled');
                    results.should.not.have.property('codfiscale');
                    results.should.not.have.property('salt');
                }
                done();
            });
        });
    });



    describe('GET /authapp/:id', function(){

        it('must return a 404, user not found', function(done){

            var url = APIURL+'/123abcd';
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    //("ERRORO"+body);
                    response.statusCode.should.be.equal(404);
                }
                done();
            });
        });
    });


    describe('GET /authapp/:id', function(){

        it('must delete a user by id', function(done){

            Apps.findOne({},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/'+ute._id;
                    request.delete({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            Apps.findOne({_id:ute._id}, function(err, usr){

                                  should(usr).be.equal(null);
                                  done();
                            });
                        }
                    });
                }
            });
        });
    });


    describe('GET /authapp/:id', function(){

        it('must return error 404 in delete a user by invalid id', function(done){

            var url = APIURL+'/123abc';
            request.delete({
                url: url,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            },function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    response.statusCode.should.be.equal(404);
                }
                done();
            });
        });
    });



    describe('GET /authapp/:id', function(){

        it('must enable a User', function(done){

            Apps.findOneAndUpdate({},{enabled:false},{new:true},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    ute.enabled.should.be.false;
                    var url = APIURL+'/'+ute._id+"/actions/enable";
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            Apps.findOne({_id:ute._id}, function(err, usr){

                                usr.enabled.should.be.true;
                                done();
                            });
                        }
                    });
                }
            });
        });
    });



    describe('GET /authapp/:id', function(){

        it('must enable a User', function(done){

            Apps.findOne({},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    ute.enabled.should.be.true;
                    var url = APIURL+'/'+ute._id+"/actions/disable";
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            Apps.findOne({_id:ute._id}, function(err, usr){

                                usr.enabled.should.be.false;
                                done();
                            });
                        }
                    });
                }
            });
        });
    });





    describe('POST /authapp/:id/actions/setusername/:newusername', function () {

        it('should set a new username', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };

            var userLogin = {
                "username": user.email,
                "password": user.password
            };

            var newUsername="changeme@changeme.it";

            var userBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Authuser: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');

                    // make a username update
                    var url = APIURL+'/'+results.userId+"/actions/setusername/"+ newUsername;
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            results = JSON.parse(response.body);
                            results.should.have.property('username');
                            results.should.have.property('token');
                            results.username.should.have.property('old');
                            results.username.should.have.property('new');
                            results.username.old.should.be.equal(user.email);
                            results.username.new.should.be.equal(newUsername);
                            results.token.should.have.property('apiKey');
                            results.token.should.have.property('refreshToken');
                            var userBodyLogin = JSON.stringify(userLogin);

                            url=APIURL+"/signin";
                            request.post({ // should not be possible login with old username
                                url: url,
                                body: userBodyLogin,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            }, function (error, response) {
                                if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(403);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('error');
                                    results.should.have.property('error_message');
                                    results.error_message.indexOf("You are not correctly authenticated").should.be.greaterThan(-1);

                                    userLogin.username=newUsername;
                                    userBodyLogin = JSON.stringify(userLogin);


                                    url=APIURL+"/signin";
                                    request.post({ // should be possible login with new username
                                        url: url,
                                        body: userBodyLogin,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                        else {
                                            response.statusCode.should.be.equal(200);
                                            var results = JSON.parse(response.body);
                                            results.should.have.property('apiKey');
                                            results.should.have.property('refreshToken');
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




    describe('POST /authapp', function () {

        it('should reset a password and get reset Token', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
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

                    // make a reset
                    var url = APIURL+'/'+results.userId+"/actions/resetpassword";
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('reset_token');
                        }
                        done();
                    });
                }
            });
        });
    });



    describe('POST /authapp', function () {
        this.timeout(5000);
        it('should reset a password, get reset Token and set a new Password', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
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

                    // make a reset
                    var url = APIURL+'/'+results.userId+"/actions/resetpassword";
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('reset_token');
                            var reset_token=results.reset_token;

                            var user = {
                                "username": "mario@caport.com",
                                "password": "miciomicio"
                            };
                            appBody = JSON.stringify(user);
                            url=APIURL+"/signin";
                            request.post({ // should be possible login with old password after reset
                                url: url,
                                body: appBody,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            }, function (error, response) {
                                if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(200);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('apiKey');
                                    results.should.have.property('refreshToken');

                                    var newpasw = {
                                        "newpassword": "maciomacio",
                                        "reset_token": reset_token
                                    };
                                    // user
                                    pswBody = JSON.stringify(newpasw);
                                    url=url = APIURL+'/'+results.userId+"/actions/setpassword";
                                    request.post({ // set new password with reset Token
                                        url: url,
                                        body: pswBody,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                        else {
                                            response.statusCode.should.be.equal(200);
                                            var results = JSON.parse(response.body);
                                            results.should.have.property('apiKey');
                                            results.should.have.property('refreshToken');

                                            url=APIURL+"/signin";
                                            request.post({ // should not be possible login with old password after reset
                                                url: url,
                                                body: appBody,
                                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                            }, function (error, response) {
                                                if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                                else {
                                                    response.statusCode.should.be.equal(403);
                                                    var results = JSON.parse(response.body);
                                                    results.should.have.property('error');
                                                    results.should.have.property('error_message');
                                                    results.error_message.indexOf("You are not correctly authenticated").should.be.greaterThan(-1);

                                                    user = {
                                                        "username": "mario@caport.com",
                                                        "password": "maciomacio"
                                                    };
                                                    appBody = JSON.stringify(user);

                                                    url=APIURL+"/signin";
                                                    request.post({ // shoul be possible login with new token
                                                        url: url,
                                                        body: appBody,
                                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                                    }, function (error, response) {
                                                        if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                                        else {
                                                            response.statusCode.should.be.equal(200);
                                                            var results = JSON.parse(response.body);
                                                            results.should.have.property('apiKey');
                                                            results.should.have.property('refreshToken');
                                                        }
                                                        done();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });



    describe('POST /authuser', function () {
        this.timeout(5000);
        it('should not reset a password of a Application by reset_token of other Application', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should create a new Authuser: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(201);
                    var results = JSON.parse(response.body);
                    results.should.have.property('apiKey');
                    results.should.have.property('refreshToken');

                    // make a reset
                    var url = APIURL+'/'+results.userId+"/actions/resetpassword";
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('reset_token');
                            var reset_token=results.reset_token;

                            var user = {
                                "username": "mario@caport.com",
                                "password": "miciomicio"
                            };
                            userBody = JSON.stringify(user);
                            url=APIURL+"/signin";
                            request.post({ // should be possible login with old password after reset
                                url: url,
                                body: userBody,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            }, function (error, response) {
                                if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(200);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('apiKey');
                                    results.should.have.property('refreshToken');


                                    //create user on which reset password with user1 reset_token
                                    var userFake = {
                                        "type": type[1], //client | admin
                                        "email": "fake@caport.com",
                                        "password": "miciomicio"
                                    };
                                    var userBody = JSON.stringify({app:userFake});
                                    var url = APIURL + '/signup';
                                    request.post({
                                        url: url,
                                        body: userBody,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######   ERRORE should create a new Authuser: " + error + "  ######");
                                        else {
                                            response.statusCode.should.be.equal(201);
                                            var resultsFake = JSON.parse(response.body);
                                            resultsFake.should.have.property('apiKey');
                                            resultsFake.should.have.property('refreshToken');


                                            var newpasw = {
                                                "newpassword": "maciomacio",
                                                "reset_token": reset_token
                                            };

                                            // user
                                            pswBody = JSON.stringify(newpasw);
                                            url=url = APIURL+'/'+resultsFake.userId+"/actions/setpassword";
                                            request.post({ // set new password with reset Token
                                                url: url,
                                                body: pswBody,
                                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                            }, function (error, response) {
                                                if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                                else {
                                                    response.statusCode.should.be.equal(401);
                                                    var results = JSON.parse(response.body);
                                                    results.should.have.property('error');
                                                    results.should.have.property('error_message');
                                                    results.error_message.should.be.equal('You are not autorised to reset password');


                                                    user = {
                                                        "username": "mario@caport.com",
                                                        "password": "miciomicio"
                                                    };
                                                    userBody = JSON.stringify(user);
                                                    url=APIURL+"/signin";
                                                    request.post({ // should be possible login user 1 with old password after reset
                                                        url: url,
                                                        body: userBody,
                                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                                    }, function (error, response) {
                                                        if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                                        else {
                                                            response.statusCode.should.be.equal(200);
                                                            var results = JSON.parse(response.body);
                                                            results.should.have.property('apiKey');
                                                            results.should.have.property('refreshToken');

                                                            user = {
                                                                "username": "fake@caport.com",
                                                                "password": "miciomicio"
                                                            };
                                                            userBody = JSON.stringify(user);

                                                            url=APIURL+"/signin";
                                                            request.post({ // shoul be possible login with userFake
                                                                url: url,
                                                                body: userBody,
                                                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                                            }, function (error, response) {
                                                                if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                                                else {
                                                                    response.statusCode.should.be.equal(200);
                                                                    var results = JSON.parse(response.body);
                                                                    results.should.have.property('apiKey');
                                                                    results.should.have.property('refreshToken');
                                                                }
                                                                done();
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });





    describe('POST /authapp', function () {
        this.timeout(5000);
        it('should set a new password', function (done) {
            var user = {
                "type": type[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var appBody = JSON.stringify({app:user});
            var url = APIURL + '/signup';
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
                    var user = {
                        "username": "mario@caport.com",
                        "password": "miciomicio"
                    };
                    appBody = JSON.stringify(user);
                    url=APIURL+"/signin";
                    request.post({ // should be possible login with password
                        url: url,
                        body: appBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                        else {
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('apiKey');
                            results.should.have.property('refreshToken');

                            var newpasw = {
                                "newpassword": "maciomacio",
                                "oldpassword": "miciomicio"
                            };
                            // user
                            pswBody = JSON.stringify(newpasw);
                            url=url = APIURL+'/'+results.userId+"/actions/setpassword";
                            request.post({ // set new password with old password
                                url: url,
                                body: pswBody,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            }, function (error, response) {
                                if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(200);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('apiKey');
                                    results.should.have.property('refreshToken');

                                    url=APIURL+"/signin";
                                    request.post({ // should not be possible login with old password after reset
                                        url: url,
                                        body: appBody,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                        else {
                                            response.statusCode.should.be.equal(403);
                                            var results = JSON.parse(response.body);
                                            results.should.have.property('error');
                                            results.should.have.property('error_message');
                                            results.error_message.indexOf("You are not correctly authenticated").should.be.greaterThan(-1);

                                            user = {
                                                "username": "mario@caport.com",
                                                "password": "maciomacio"
                                            };
                                            appBody = JSON.stringify(user);

                                            url=APIURL+"/signin";
                                            request.post({ // shoul be possible login with new token
                                                url: url,
                                                body: appBody,
                                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                            }, function (error, response) {
                                                if (error) console.log("######  ERRORE should  login a Application: " + error +"  ######");
                                                else {
                                                    response.statusCode.should.be.equal(200);
                                                    var results = JSON.parse(response.body);
                                                    results.should.have.property('apiKey');
                                                    results.should.have.property('refreshToken');
                                                }
                                                done();
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });



    describe('post /authuser/actions/ids/find', function(){

        it('must get users by ids. all fields', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ids})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var resp=JSON.parse(body);
                            resp.should.have.property('_metadata');
                            resp.should.have.property('apps');
                            resp.apps.length.should.be.equal(3);
                            done();
                        }
                    });
                }
            });
        });
    });


    describe('post /authuser/actions/ids/find', function(){

        it('must get users by ids. type fields', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ids,fields:["type"]})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var resp=JSON.parse(body);
                            resp.should.have.property('_metadata');
                            resp.should.have.property('apps');
                            resp.apps.length.should.be.equal(3);
                            resp.apps[0].should.not.have.property("email");
                            resp.apps[0].should.not.have.property("enabled");
                            resp.apps[0].should.have.property("type");
                            done();
                        }
                    });
                }
            });
        });
    });

    describe('post /authuser/actions/ids/find', function(){

        it('must get users by ids. type,email fields', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ids,fields:["type","email"]})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var resp=JSON.parse(body);
                            resp.should.have.property('_metadata');
                            resp.should.have.property('apps');
                            resp.apps.length.should.be.equal(3);
                            resp.apps[0].should.have.property("email");
                            resp.apps[0].should.not.have.property("enabled");
                            resp.apps[0].should.have.property("type");
                            done();
                        }
                    });
                }
            });
        });
    });



    describe('post /authuser/actions/ids/find', function(){

        it('must get an error due invalid fields', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ids,fields:"type,email"})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(400);
                            var resp=JSON.parse(body);
                            resp.should.have.property('error');
                            resp.should.have.property('error_message');
                            done();
                        }
                    });
                }
            });
        });
    });

    describe('post /authuser/actions/ids/find', function(){

        it('must get an error due invalid fields', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ids,fields:{"type":"type","email":"email"}})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(400);
                            var resp=JSON.parse(body);
                            resp.should.have.property('error');
                            resp.should.have.property('error_message');
                            done();
                        }
                    });
                }
            });
        });
    });


    describe('post /authuser/actions/ids/find', function(){

        it('must get an error due invalid ids', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ute[0]._id})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(400);
                            var resp=JSON.parse(body);
                            resp.should.have.property('error');
                            resp.should.have.property('error_message');
                            done();
                        }
                    });
                }
            });
        });
    });


    describe('post /authuser/actions/ids/find', function(){

        it('must get an error no ids', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({ids:ute[0]._id})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(400);
                            var resp=JSON.parse(body);
                            resp.should.have.property('error');
                            resp.should.have.property('error_message');
                            resp.error_message.should.be.equal("ids param must be an array");
                            done();
                        }
                    });
                }
            });
        });
    });


    describe('post /authuser/actions/ids/find', function(){

        it('must get an error no ids', function(done){

            Apps.find({},null,{limit:3},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/actions/ids/find';
                    var ids=[ute[0]._id,ute[1]._id,ute[2]._id];
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        //body:JSON.stringify({ids:ute[0]._id})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(400);
                            var resp=JSON.parse(body);
                            resp.should.have.property('error');
                            resp.should.have.property('error_message');
                            resp.error_message.should.be.equal("mandatory 'ids' body param not found");
                            done();
                        }
                    });
                }
            });
        });
    });


 });
