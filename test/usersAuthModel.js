var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("./dbTest");
var User = require('../models/users').User;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var conf=require('../config').conf;

var util = require('util');


describe('MS Auth Model', function(){

  before(function(done){

    db.connect("usersAuthModel",function(){
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
    var type=conf.userType;
    async.each(range, function(e,cb){


        User.create({
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
      User.remove(function(err, p){
          if(err) throw err;
          done();
      });
  });



  describe('findAll({skip:2, limit:30})', function(){

    it('must include _metadata with correct values', function(done){

      User.findAll({}, null, {skip:2, limit:30}, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.users.length.should.be.equal(30);
            results._metadata.skip.should.be.equal(2);
            results._metadata.limit.should.be.equal(30);
            results._metadata.should.have.property('totalCount');
            results._metadata.totalCount.should.be.equal(101); // one is the default admin user

          }
          done();
      });

    });

  });


  describe('findAll({skip:0, limit:10})', function(){

    it('must include _metadata with correct values', function(done){
      User.findAll({}, null, {skip:0, limit:10}, function(err, results){
          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.users.length.should.be.equal(10);
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

      User.findAll({}, null, null, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.users.length.should.be.equal(50);
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

      User.findAll({}, null, {skip:0, limit:2}, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.users.length.should.be.equal(2);
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

      User.findOne({}, null, function(err, user){

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

});
