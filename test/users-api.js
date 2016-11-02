var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("./dbTest");
var Users = require('../models/users').User;
var conf = require('../config').conf;

var request = require('request');

var app = require('../app');
var util = require('util');

var Port = 3055;
var APIURL = 'http://localhost:' + Port + "/authuser";


var server;
//var token = conf.MyMicroserviceToken;
var type = conf.userType;

var adminUser;

var clientUser;
var clientToken;

describe('Users API', function () {

    before(function (done) {
        //this.timeout(4000);
        //
        //console.log("BEFORE");
        db.connect("users-api",function (err) {
            if (err) console.log("######   ERRORE BEFORE : " + err +"  ######");

            app.set('port', process.env.PORT || Port);

            server = app.listen(app.get('port'), function () {
                console.log('TEST Express server listening on port ' + server.address().port);
                done();
            });
        });
    });

    after(function (done) {
        //console.log("AFTER");
        Users.remove({}, function (err,elm) {
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

        //Add cars
       // console.log("BEFORE EACH");
        async.each(range, function (e, cb) {

            Users.create({
                email: "email" + e + "@email.it",
                type: type[_.random(0, type.length - 1)]
            }, function (err, newuser) {
                if (err) console.log("######   ERRORE BEFOREEACH: " + err +"  ######");
                //console.log(e);
                if(e==1) clientUser=newuser._id;
                cb();
            });

        }, function (err) {
            done();
        });
    });


    afterEach(function (done) {
        //console.log("AFTER EACH");
        Users.remove({}, function (err, elm) {
            if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
            done();
        });
    });



    describe('POST /authuser/signin', function () {

        it('should not login a Authuser no body sended', function (done) {
            var user = {
                "type": "nonvalido", //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify(user);
            //console.log("BODY " + userBody);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                // body : userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error){
                    console.log("######   ERRORE should not login a Authuser no body sended: " + error +"  ######");
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


    describe('POST /authuser/signin', function () {

        it('should not login a Authuser no username sended', function (done) {
            var user = {
                //"type": "nonvalido", //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify(user);
           // console.log("BODY " + userBody);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error)  console.log("######   ERRORE should not login a Authuser no username sended: " + error +"  ######");
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





    describe('POST /authuser/signin', function () {

        it('should not login a Authuser no password sended', function (done) {
            var user = {
                //"type": "nonvalido", //client | admin
                "username": "mario@caport.com",
                //"password": "miciomicio"
            };
            var userBody = JSON.stringify(user);
            //console.log("BODY " + userBody);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should not login a Authuser no password sended: " + error +"  ######");
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


    describe('POST /authuser/signin', function () {

        it('should not login a Authuser invalid username sended', function (done) {
            var user = {
                //"type": "nonvalido", //client | admin
                "username": "mario@caportcom",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify(user);
            //console.log("BODY " + userBody);
            var url = APIURL + '/signin';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should not login a Authuser invalid username sended: " + error +"  ######");
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


    describe('POST /authuser/signin', function () {

        it('should login a Authuser', function (done) {


            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######  1 ERRORE should  login a Authuser: " + error +"  ######");
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
                    var userBody = JSON.stringify(user);

                    request.post({
                        url: url,
                        body: userBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######  2 ERRORE should  login a Authuser: " + error +"  ######");
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


    describe('POST /authuser/signin', function () {

        it('should not login a Authuser bad User', function (done) {


            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE should not login a Authuser bad User: " + error +"  ######");
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
                    var userBody = JSON.stringify(user);

                    request.post({
                        url: url,
                        body: userBody,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response) {
                        if (error) console.log("######  2 ERRORE should not login a Authuser bad User: " + error +"  ######");
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



    describe('POST /authuser', function () {

        it('should create a new Authuser', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
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
                }
                done();
            });
        });
    });



    describe('POST /authuser/signin', function () {

        it('should not login a Authuser bad Password', function (done) {


            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
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
                    var userBody = JSON.stringify(user);

                    request.post({
                        url: url,
                        body: userBody,
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


    describe('POST /authuser', function () {

        it('should not create a new Authuser no body sended', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                //body : userBody,
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


    describe('POST /authuser', function () {

        it('should not create a new Authuser no email sended', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                //"email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
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


    describe('POST /authuser', function () {

        it('should not create a new Authuser no User type sended', function (done) {
            var user = {
                //"type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
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




    describe('POST /authuser', function () {

        it('should not create a new Authuser no Password type sended', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                //"password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
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



    describe('GET /authuser', function () {

        it('must return ONE user and _metadata, all fields', function (done) {

           // console.log("SEND TEST");

            request.get({
                url: APIURL + '?skip=0&limit=1',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    //console.log("ERR MSG:" + body);
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);

                    results.should.have.property('_metadata');
                    results.should.have.property('users');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(1);
                    results._metadata.totalCount.should.be.equal(100);
                    //should.exist(results.users[0].hash);
                    //should.exist(results.users[0].salt);
                    should.exist(results.users[0].email);
                    should.exist(results.users[0].type);
                    should.exist(results.users[0].enabled);
                }
                done();
            });

        });

    });






    describe('GET /authuser', function () {

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
                    results.should.have.property('users');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(2);
                    results._metadata.totalCount.should.be.equal(100);
                    should.exist(results.users[0].email);
                    should.exist(results.users[0].type);
                    should.exist(results.users[0].enabled);
                }
                done();
            });
        });
    });






    describe('GET /authuser', function () {

        it('must return  error 400 for invalid token', function (done) {

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




    describe('GET /authuser', function () {

        it('must return  no error for invalid field', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2&fields=type,codFisc',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    //console.log("EREWREWREWRWEREW " +body);
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);
                    results.should.have.property('_metadata');
                    results.should.have.property('users');
                    should.not.exist(results.users[0].email);
                    should.exist(results.users[0].type);
                    should.not.exist(results.users[0].codFisc);
                    should.not.exist(results.users[0].salt);
                }
                done();
            });
        });
    });


    describe('GET /authuser', function () {

        it('must return  error 400 for Access_token required', function (done) {

            request.get({url: APIURL + '?skip=0&limit=2'}, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    //console.log("ERRMSG" + results.error_message)
                    response.statusCode.should.be.equal(400);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });


    describe('POST /authuser', function () {
        this.timeout(10000);

        it('should not create a new Authuser no valid User type sended', function (done) {
            //console.log("test 1 start");
            var user = {
                "type": "nonvalido", //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
          //  console.log("BODY " + userBody);
            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(400);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("No valid User Type provided");
                }

                done();
            });
        });

    });



    describe('POST /authuser', function () {
        this.timeout(10000);

        it('should not create a new Authuser no valid field sended', function (done) {

            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio",
                "cofdFisc":"ABAA"
            };
            var userBody = JSON.stringify({user:user});

            var url = APIURL + '/signup';
            request.post({
                url: url,
                body: userBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response,body) {
                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(500);
                    var results = JSON.parse(response.body);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.indexOf("Unable to register user").should.be.greaterThan(-1);
                }
                done();
            });
        });

    });



    describe('GET /authuser', function () {
        this.timeout(10000);

        try {
            it('must return  error 401 for Unauthorized token', function (done) {
               // console.log("test 2 start");
                var user = {
                    "type": conf.userType[1], //client | admin
                    "email": "mario@caport.com",
                    "password": "miciomicio"
                };
                var userBody = JSON.stringify({user:user});
               // console.log("BODY " + userBody);
                var url = APIURL + '/signup';
                var results;

                request.post({
                    url: url,
                    body: userBody,
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                }, function (error, response) {
                    if (error) console.log("######   ERRORE 401 1: " + error + "  ######");
                    else {
                       // console.log("ERROR:" + response.body);
                        response.statusCode.should.be.equal(201);
                        results = JSON.parse(response.body);
                        results.should.have.property('apiKey');
                        results.should.have.property('refreshToken');
                    }
                   // console.log("ENDONE");

                    request.get({
                        url: APIURL + '?skip=0&limit=2',
                        headers: {'Authorization': "Bearer " + results.apiKey.token}
                    }, function (error, response, body) {

                        if (error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else {
                           // console.log("BODYBODY" + body);
                            results = JSON.parse(body);
                            response.statusCode.should.be.equal(401);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("The access token is not a valid microservice Token");
                        }
                      //  console.log("ENDTWO");
                       // console.log("test 2 end");
                        done();
                    });
                });

            });
        }catch (err){
           // console.log("TIENI " + err);

        }
    });



    describe('GET /authuser/:id', function(){

        it('must return a user by id, all fields', function(done){

            var url = APIURL+'/'+clientUser;
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
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



    describe('GET /authuser/:id', function(){

        it('must return a user by id, fields type', function(done){

            var url = APIURL+'/'+clientUser+"?fields=type";
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
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



    describe('GET /authuser/:id', function(){

        it('must return a user by id, send an invalid field', function(done){

            var url = APIURL+'/'+clientUser+"?fields=type,codfiscale";
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
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



    describe('GET /authuser/:id', function(){

        it('must return a 404, user not found', function(done){

            var url = APIURL+'/123abcd';
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                else{
                    console.log("ERRORO"+body);
                    response.statusCode.should.be.equal(404);
                }
                done();
            });
        });
    });


    describe('GET /authuser/:id', function(){

        it('must delete a user by id', function(done){

            Users.findOne({},function(error,ute){
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
                            Users.findOne({_id:ute._id}, function(err, usr){

                                  should(usr).be.equal(null);
                                  done();
                            });
                        }
                    });
                }
            });
        });
    });


    describe('GET /authuser/:id', function(){

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



    describe('GET /authuser/:id', function(){

        it('must enable a User', function(done){

            Users.findOneAndUpdate({},{enabled:false},{new:true},function(error,ute){
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
                            Users.findOne({_id:ute._id}, function(err, usr){

                                usr.enabled.should.be.true;
                                done();
                            });
                        }
                    });
                }
            });
        });
    });



    describe('GET /authuser/:id', function(){

        it('must disable a User', function(done){

            Users.findOne({},function(error,ute){
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
                            Users.findOne({_id:ute._id}, function(err, usr){

                                usr.enabled.should.be.false;
                                done();
                            });
                        }
                    });
                }
            });
        });
    });






    describe('POST /authuser', function () {

        it('should reset a password and get reset Token', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
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
                            done();
                        }
                    });
                }
            });
        });
    });



    describe('POST /authuser', function () {
        this.timeout(5000);
        it('should reset a password, get reset Token and set a new Password', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
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
                                        if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                        else {
                                            response.statusCode.should.be.equal(200);
                                            var results = JSON.parse(response.body);
                                            results.should.have.property('apiKey');
                                            results.should.have.property('refreshToken');

                                            url=APIURL+"/signin";
                                            request.post({ // should not be possible login with old password after reset
                                                url: url,
                                                body: userBody,
                                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                            }, function (error, response) {
                                                if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
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
                                                    userBody = JSON.stringify(user);

                                                    url=APIURL+"/signin";
                                                    request.post({ // shoul be possible login with new token
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
        });
    });





    describe('POST /authuser', function () {
        this.timeout(5000);
        it('should set a new password', function (done) {
            var user = {
                "type": conf.userType[1], //client | admin
                "email": "mario@caport.com",
                "password": "miciomicio"
            };
            var userBody = JSON.stringify({user:user});
            //console.log("BODY " + userBody);
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
                    var user = {
                        "username": "mario@caport.com",
                        "password": "miciomicio"
                    };
                    userBody = JSON.stringify(user);
                    url=APIURL+"/signin";
                    request.post({ // should be possible login with password
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
                                if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
                                else {
                                    response.statusCode.should.be.equal(200);
                                    var results = JSON.parse(response.body);
                                    results.should.have.property('apiKey');
                                    results.should.have.property('refreshToken');

                                    url=APIURL+"/signin";
                                    request.post({ // should not be possible login with old password after reset
                                        url: url,
                                        body: userBody,
                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                                    }, function (error, response) {
                                        if (error) console.log("######  ERRORE should  login a Authuser: " + error +"  ######");
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
                                            userBody = JSON.stringify(user);

                                            url=APIURL+"/signin";
                                            request.post({ // shoul be possible login with new token
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
        });
    });
});
