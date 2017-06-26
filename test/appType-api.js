var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("./dbTest");
var UserAndAppTypes = require('../models/userAndAppTypes').UserAndAppTypes;
var authorization = require('../models/authEndpoints').AuthEndPoint;
var conf = require('../config').conf;
var Apps = require('../models/apps').Apps;
var commonFunction=require('../routes/commonfunctions');

var request = require('request');

var app = require('../app');
var util = require('util');

var Port = 3055;
var APIURL = 'http://localhost:' + Port + "/apptypes";


var server;
//var token = conf.MyMicroserviceToken;

var userTypeID;
var oldAppType;
var olduserType;







describe('appType-Api API', function () {

    before(function (done) {
        oldAppType=conf.appType;
        olduserType=conf.userType;



        db.connect("appType-api",function (err) {
            if (err) console.log("######   ERRORE BEFORE : " + err +"  ######");

            UserAndAppTypes.remove({},function(err, p){
                if(err) throw err;
                app.set('port', process.env.PORT || Port);

                server = app.listen(app.get('port'), function () {
                    console.log('TEST Express server listening on port ' + server.address().port);
                    done();

                });
            });

        });
    });

    after(function (done) {
        UserAndAppTypes.remove({}, function (err,elm) {
            if (err) console.log("######   ERRORE After 1: " + err +"  ######");
            db.disconnect(function (err,res) {
                if (err) console.log("######   ERRORE After 2: " + err +"  ######");
                server.close();
                conf.appType=oldAppType;
                conf.userType=olduserType;
              
                done();
            });

        });
    });


    beforeEach(function (done) {

        var range = _.range(100);

        async.each(range, function (e, cb) {

            UserAndAppTypes.create({
                name: "NOME" + e ,
                type: "app"
            }, function (err, newuser) {
                if (err) console.log("######   ERRORE BEFOREEACH: " + err +"  ######");
                 if(e==1) userTypeID=newuser._id;
                cb();
            });

        }, function (err) {
            commonFunction.updateMicroservice(function() {
                commonFunction.updateApp(function () {
                    commonFunction.updateUsers(function () {
                        done();
                    });
                });
            });
        });
    });


    afterEach(function (done) {
        UserAndAppTypes.remove({}, function (err, elm) {
            if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
            Apps.remove({}, function (err, elm) {
                if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
                authorization.remove({}, function (err, elm) {
                    if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
                    done();
                });
            });
        });
    });



    ///BEGIN

    describe('GET /apptypes', function () {

        it('must return ONE app type and _metadata, all fields', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=1',
                headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);

                    results.should.have.property('_metadata');
                    results.should.have.property('userandapptypes');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(1);
                    results._metadata.totalCount.should.be.equal(100);

                    should.exist(results.userandapptypes[0].name);
                    should.exist(results.userandapptypes[0].type);

                }
                done();
            });

        });

    });


    describe('GET /apptypes', function () {

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
                    results.should.have.property('userandapptypes');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(2);
                    results._metadata.totalCount.should.be.equal(100);
                    should.exist(results.userandapptypes[0].name);
                    should.exist(results.userandapptypes[0].type);
                }
                done();
            });
        });
    });






    describe('GET /apptypes', function () {

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




    describe('GET /apptypes', function () {

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
                    results.should.have.property('userandapptypes');
                    should.not.exist(results.userandapptypes[0].name);
                    should.exist(results.userandapptypes[0].type);
                }
                done();
            });
        });
    });


    describe('GET /apptypes', function () {

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



    describe('GET /apptypes', function () {

        it('must return  error 404 Not Found', function (done) {

            UserAndAppTypes.remove({},function(err,data){
                request.get({url: APIURL + '?skip=0&limit=2',   headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken}}, function (error, response, body) {

                    if (error) console.log("######   ERRORE: " + error +"  ######");
                    else {
                        var results = JSON.parse(body);
                        response.statusCode.should.be.equal(404);
                        results.should.have.property('_metadata');
                        results.should.have.property('userandapptypes');
                        results._metadata.totalCount.should.be.equal(0);
                    }
                    done();
                });
            });
        });
    });




    describe('GET /apptypes/:id', function(){

        it('must return a app type by id, all fields', function(done){

            var url = APIURL+'/'+userTypeID;
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{

                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(response.body);
                    results.should.have.property('name');
                    results.should.have.property('type');
                }
                done();
            });
        });
    });




    describe('GET /apptypes/:id', function(){

        it('must return a 500, app type not valid', function(done){

            var url = APIURL+'/123abcd';
            request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    response.statusCode.should.be.equal(500);
                }
                done();
            });
        });
    });


    describe('GET /apptypes/:id', function(){

        it('must return a 404, not found', function(done){

            UserAndAppTypes.findOneAndRemove({},function(err,ited){
                var url = APIURL+"/"+ited._id;
                request.get({url:url,headers:{'Authorization' : "Bearer "+ conf.MyMicroserviceToken}},function(error, response, body){
                    if(error) console.log("######   ERRORE: " + error + "  ######");
                    else{
                        response.statusCode.should.be.equal(404);
                    }
                    done();
                });
            });

        });
    });



    describe('DELETE /apptypes/:id', function(){

        it('must delete app type by id', function(done){

            UserAndAppTypes.findOne({},function(error,ute){
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
                            UserAndAppTypes.findOne({_id:ute._id}, function(err, usr){

                                  should(usr).be.equal(null);
                                  done();
                            });
                        }
                    });
                }
            });
        });
    });



    describe('DELETE /apptypes/:id', function(){

        it('must get invalid token in delete app type by id', function(done){

            UserAndAppTypes.findOne({},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/'+ute._id;
                    request.delete({
                        url: url,
                        headers: {'Authorization': "Bearer " + conf.MyMicroserviceToken + "d"}
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(400);
                            done();
                        }
                    });
                }
            });
        });
    });


    describe('DELETE /apptypes/:id', function(){

        it('must return error 404 in delete app type by invalid id', function(done){

            UserAndAppTypes.findOne({},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/'+ute._id;

                    UserAndAppTypes.findByIdAndRemove(ute._id,function(err,val){
                        request.delete({
                            url: url,
                            headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                        },function(error, response, body){
                            if(error) console.log("######   ERRORE: " + error + "  ######");
                            else{
                                response.statusCode.should.be.equal(404);
                                UserAndAppTypes.findOne({_id:ute._id}, function(err, usr){
                                    should(usr).be.equal(null);
                                    done();
                                });
                            }
                        });
                    });


                }
            });
        });
    });



    describe('DELETE /apptypes/:id', function(){

        it('must return error 409 in delete  due some app of this type exist', function(done){

            Apps.create({email:"prova@prova.it", type:conf.appType[0]},function(err,app){
                if (err) console.log("######   ERRORE: " + err + "  ######");
                else{
                    UserAndAppTypes.findOne({name:conf.appType[0]},function(error,ute){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            var url = APIURL+'/'+ute._id;
                            request.delete({
                                url: url,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            },function(error, response, body){
                                if(error) console.log("######   ERRORE: " + error + "  ######");
                                else{
                                    response.statusCode.should.be.equal(409);
                                    var results = JSON.parse(response.body);
                                    results.error_message.should.be.equal("token type " + ute.name + " is not deleted due some app of this type could be exist");

                                    UserAndAppTypes.findOne({name:ute.name}, function(error, usr){
                                        if(error) console.log("######   ERRORE: " + error + "  ######");
                                        else{
                                            usr.should.be.not.equal(null);
                                            done();
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

    describe('DELETE /apptypes/:id', function(){

        this.timeout(4000);

        it('must return error 409 in delete  due some auth token rules include this app type ', function(done){

            authorization.create({URI:"/bleee",method:"POST",name:conf.msType[0],authToken:[conf.appType[0]]},function(err,valAuth){
                if (err) console.log("######   ERRORE1: " + err + "  ######");
                else{
                    UserAndAppTypes.findOne({name:conf.appType[0]},function(error,ute){
                        if(error) console.log("######   ERRORE2: " + error + "  ######");
                        else{
                            var url = APIURL+'/'+ute._id;
                            request.delete({
                                url: url,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                            },function(error, response, body){
                                if(error) console.log("######   ERRORE3: " + error + "  ######");
                                else{
                                    response.statusCode.should.be.equal(409);
                                    var results = JSON.parse(response.body);
                                    results.error_message.should.be.equal("token type " + ute.name + " is not deleted due some rule with this token type could be exist");

                                    UserAndAppTypes.findOne({name:ute.name}, function(error, usr){
                                        if(error) console.log("######   ERRORE4: " + error + "  ######");
                                        else{
                                            usr.should.be.not.equal(null);
                                            authorization.findOne({authToken:ute.name},function(err,valA){
                                                if(err) console.log("######   ERRORE5: " + err + "  ######");
                                                valA.should.be.not.equal(null);
                                                done();
                                            })
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


    describe('UPDATE /apptypes/:id', function(){

        it('must get BadRequest error(no apptype parameter in body) in put by id', function(done){

            UserAndAppTypes.findOne({}, function (error, ute) {
                if (error) console.log("######   ERRORE: " + error + "  ######");
                else {
                    var url = APIURL + '/' + ute._id;
                    request.put({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response, body) {
                        if (error) console.log("######   ERRORE: " + error + "  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(body);
                            results.error_message.should.be.equal('No apptype provided');
                            done();
                        }
                    });
                }
            });


        });
    });



    describe('UPDATE /apptypes/:id', function(){

        it('must get update error for duplicate key name', function(done){

            UserAndAppTypes.findOne({name:conf.appType[0]},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/'+ute._id;
                    request.put({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({apptype:{name:conf.appType[1]}})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{                            
                            response.statusCode.should.be.equal(500);
                            var results = JSON.parse(body);
                            results.error_message.indexOf("Unable to update app token type").should.be.not.equal(-1);
                            done();
                        }
                    });
                }
            });
        });
    });



    describe('UPDATE /apptypes/:id', function(){

        it('must update app type', function(done){

            UserAndAppTypes.findOne({name:conf.appType[0]},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL+'/'+ute._id;
                    request.put({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({apptype:{name:"updated"}})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(body);
                            results.name.should.be.equal("updated");
                            done();
                        }
                    });
                }
            });
        });
    });



    describe('UPDATE /apptypes/:id', function(){

        it('must update app type and all linked data', function(done){

            var nameType=conf.appType[0];

            authorization.create({URI:"/bleee",method:"POST",name:conf.msType[0],authToken:[nameType]},function(error,valAuth){
                if(error) console.log("######   ERRORE1_: " + error + "  ######");
                else{
                    Apps.create({email:"prova@prova.it", type:nameType},function(error,app){
                        if (error) console.log("######   ERRORE2: " + error + "  ######");
                        else{
                            UserAndAppTypes.findOne({name:nameType},function(error,ute){
                                if(error) console.log("######   ERRORE3: " + error + "  ######");
                                else{
                                    var url = APIURL+'/'+ute._id;

                                    authorization.find({authToken:nameType},function(err,tok){
                                        if(err) console.log("######   ERRORE4: " + error + "  ######");
                                        else{
                                            tok.should.be.not.null;
                                            Apps.find({type:nameType},function(err,appT){
                                                if(err) console.log("######   ERRORE5: " + error + "  ######");
                                                else{
                                                    appT.should.be.not.null;

                                                    authorization.find({authToken:"updated"},function(err,tok){
                                                        if(err) console.log("######   ERRORE6: " + error + "  ######");
                                                        else{
                                                            _.isEmpty(tok).should.be.true;
                                                            Apps.find({type:"updated"},function(err,appT){
                                                                if(err) console.log("######   ERRORE7: " + error + "  ######");
                                                                else{
                                                                    _.isEmpty(appT).should.be.true;
                                                                    request.put({
                                                                        url: url,
                                                                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                                                                        body:JSON.stringify({apptype:{name:"updated"}})
                                                                    },function(error, response, body){
                                                                        if(error) console.log("######   ERRORE8: " + error + "  ######");
                                                                        else{
                                                                            response.statusCode.should.be.equal(200);
                                                                            var results = JSON.parse(body);
                                                                            results.name.should.be.equal("updated");
                                                                            authorization.find({authToken:nameType},function(err,tok){
                                                                                if(err) console.log("######   ERRORE9: " + error + "  ######");
                                                                                else {
                                                                                    _.isEmpty(tok).should.be.true;
                                                                                    Apps.find({type: nameType}, function (err, appT) {
                                                                                        if(err) console.log("######   ERRORE10: " + error + "  ######");
                                                                                        else {
                                                                                            _.isEmpty(appT).should.be.true;
                                                                                            authorization.find({authToken: "updated"}, function (err, tok) {
                                                                                                if(err) console.log("######   ERRORE11: " + error + "  ######");
                                                                                                else {
                                                                                                    tok.should.be.not.null;
                                                                                                    Apps.find({type: "updated"}, function (err, appT) {
                                                                                                        if(err) console.log("######   ERRORE12: " + error + "  ######");
                                                                                                        else {
                                                                                                            appT.should.be.not.null;
                                                                                                            done();
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



    describe('POST /apptypes', function(){

        it('must get BadRequest error(no apptype parameter in body)', function(done){

            UserAndAppTypes.findOne({}, function (error, ute) {
                if (error) console.log("######   ERRORE: " + error + "  ######");
                else {
                    var url = APIURL;
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
                    }, function (error, response, body) {
                        if (error) console.log("######   ERRORE: " + error + "  ######");
                        else {
                            response.statusCode.should.be.equal(400);
                            var results = JSON.parse(body);
                            results.error_message.should.be.equal('No apptype provided');
                            done();
                        }
                    });
                }
            });
        });
    });



    describe('POST /apptypes/:id', function(){

        it('must get update error for duplicate key name', function(done){

            var url = APIURL;
            request.post({
                url: url,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                body:JSON.stringify({apptype:{name:conf.appType[0]}})
            },function(error, response, body){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    response.statusCode.should.be.equal(409);
                    var results = JSON.parse(body);
                    results.error_message.indexOf("this App Type").should.be.not.equal(-1);
                    results.error_message.indexOf("Already exist").should.be.not.equal(-1);
                    done();
                }
            });
        });
    });



    describe('UPDATE /apptypes/:id', function(){

        it('must update app type', function(done){

            var newappname="NewApp";
            UserAndAppTypes.findOne({name:newappname},function(error,ute){
                if(error) console.log("######   ERRORE: " + error + "  ######");
                else{
                    var url = APIURL;
                    should.not.exist(ute);
                    request.post({
                        url: url,
                        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken},
                        body:JSON.stringify({apptype:{name:newappname}})
                    },function(error, response, body){
                        if(error) console.log("######   ERRORE: " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(201);
                            var results = JSON.parse(body);
                            results.name.should.be.equal(newappname);
                            UserAndAppTypes.findOne({name:newappname},function(error,ute) {
                                if (error) console.log("######   ERRORE: " + error + "  ######");
                                ute.name.should.be.equal(newappname);
                                done();
                            });
                        }
                    });
                }
            });
        });
    });






 });
