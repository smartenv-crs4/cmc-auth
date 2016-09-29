var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("./dbTest");
var MS = require('../models/microservices').Microservice;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var conf=require('../config').conf;

var util = require('util');


describe('MS Auth Model', function(){

  before(function(done){

    db.connect("msAuthModel",function(){
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


        MS.create({
            name:"nome" + e,
            token:"token" + e,
            baseUrl:"localhost" + e
        },function(err,val){
            if (err) throw err;
            cb();
        });

    }, function(err){
        done();
      });
    });


  afterEach(function(done){
      MS.remove({name:{$nin:["authms", "userms", "appms"]}},function(err, p){
          if(err) throw err;
          done();
      });
  });




   //NB {name:{$ne:"authms"}} there is a saved token called authms for this ms




  describe('findAll({skip:2, limit:30})', function(){

    it('must include _metadata with correct values', function(done){

      MS.findAll({name:{$nin:["authms", "userms", "appms"]}}, null, {skip:2, limit:30}, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.microservices.length.should.be.equal(30);
            results._metadata.skip.should.be.equal(2);
            results._metadata.limit.should.be.equal(30);
            results._metadata.should.have.property('totalCount');
            results._metadata.totalCount.should.be.within(100,105);

          }
          done();
      });

    });

  });


  describe('findAll({skip:0, limit:10})', function(){

    it('must include _metadata with correct values', function(done){
      MS.findAll({name:{$nin:["authms","userms", "appms"]}}, null, {skip:0, limit:10}, function(err, results){
          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.microservices.length.should.be.equal(10);
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

      MS.findAll({name:{$nin:["authms","userms", "appms"]}}, null, null, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.microservices.length.should.be.equal(50);
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

      MS.findAll({name:{$nin:["authms","userms", "appms"]}}, null, {skip:0, limit:2}, function(err, results){

          if(err) throw err;
          else{
            results.should.have.property('_metadata');
            results.microservices.length.should.be.equal(2);
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

      MS.findOne({name:{$ne:"authms"}}, null, function(err, user){

          if(err) throw err;
          else{
            user.should.have.property('name');
            user.should.have.property('icon');
            user.should.have.property('baseUrl');
            user.should.have.property('token');
          }
          done();
      });

    });

  });

});
