var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("./dbTest");
var App = require('../models/apps').Apps;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var conf=require('../routes/configSettingManagment');

var util = require('util');
var type=conf.getParam("appType");

describe('MS Auth Model', function(){

  before(function(done){

    db.connect("appsAuthModel",function(){
      done();
    });
  });

  after(function(done){

    db.disconnect(function(){
      done();
    });
  });


  beforeEach(function(done){

    var range = _.range(100);
    
    async.each(range, function(e,cb){


        App.create({
            email:"email" + e + "@email.it",
            type: type[_.random(0,type.length-1)]
        },function(err,val){
            if (err) throw err;
            cb();
        });

    }, function(err){
        done();
      });
    });


  afterEach(function(done){
      App.remove(function(err, p){
          if(err) throw err;
          done();
      });
  });



  describe('findAll({skip:2, limit:30})', function(){

    it('must include _metadata with correct values', function(done){

      App.findAll({}, null, {skip:2, limit:30}, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.apps.length.should.be.equal(30);
            results._metadata.skip.should.be.equal(2);
            results._metadata.limit.should.be.equal(30);
            results._metadata.should.have.property('totalCount');
            results._metadata.totalCount.should.be.equal(100);

          }
          done();
      });

    });

  });


  describe('findAll({skip:0, limit:10})', function(){

    it('must include _metadata with correct values', function(done){
      App.findAll({}, null, {skip:0, limit:10}, function(err, results){
          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.apps.length.should.be.equal(10);
            results._metadata.skip.should.be.equal(0);
            results._metadata.limit.should.be.equal(10);
            results._metadata.totalCount.should.be.equal(100);

          }
          done();
      });

    });

  });


  describe('findAll() no pagination', function(){

    it('must include _metadata with default values', function(done){

      App.findAll({}, null, null, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.apps.length.should.be.equal(50);
            results._metadata.skip.should.be.equal(0);
            results._metadata.limit.should.be.equal(50);
            results._metadata.totalCount.should.be.equal(100);

          }
          done();
      });

    });

  });

  describe('findAll({skip:0, limit:2})', function(){

    it('must include _metadata with correct values and only 2 entries', function(done){

      App.findAll({}, null, {skip:0, limit:2}, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.apps.length.should.be.equal(2);
            results._metadata.skip.should.be.equal(0);
            results._metadata.limit.should.be.equal(2);
            results._metadata.totalCount.should.be.equal(100);

          }
          done();

      });

    });

  });

  describe('findOne()', function(){

    it('must include all required properties', function(done){

      App.findOne({}, null, function(err, user){

          if(err) throw err;
          else{
            user.should.have.property('email');
            user.should.have.property('type');
            user.should.have.property('enabled');
          }
          done();
      });
    });
  });


    describe('Strict throw test', function(){

        it('must thow an exception for not in schema value', function(done){

            try {
                App.create({
                    email:"email@email.it",
                    type: "AuthMs",
                    notInSchema:true
                },function(err,val){

                    false.should.be.true;
                    done();
                });
            }catch(ex) {
                console.log("ex:" + ex);
                ex.message.should.be.equal("Field `notInSchema` is not in schema and strict mode is set to throw.");
                done();
            }
        });
    });


    describe('Strict throw test', function(){

        it('must thow an exception for invalid App Type', function(done){

            try {
                App.create({
                    email:"email@email.it",
                    type: "INVALID"
                },function(err,val){
                    should.exist(err);
                    var errstring="err:"+ err
                    console.log(errstring);
                    errstring.should.be.equal("err:Error: 'INVALID' is not a valid value for app field `type`[webui,ext,user,ms].");
                    done();
                });
            }catch(ex) {
                console.log("ex:" + ex);
                done();
            }
        });
    });

    describe('Strict throw test', function(){

        it('must thow an exception for invalid App Type', function(done){

            try {
                App.create({
                    email:"email@email.it",
                    type: conf.getParam("appType")[0]
                },function(err,val){
                    should.exist(val);
                    done();
                });
            }catch(ex) {
                console.log("ex:" + ex);
                done();
            }
        });
    });

});
