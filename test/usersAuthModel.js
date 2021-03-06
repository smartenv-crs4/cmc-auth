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
var User = require('../models/users').User;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var conf=require('../routes/configSettingManagment');
var util = require('util');
commonfunctions=require('../routes/commonfunctions');
var tokenTypes = require('../models/userAndAppTypes').UserAndAppTypes;


describe('MS Auth Model', function(){

    before(function (done) {

        db.connect("usersAuthModel", function () {
            done();
        });
    });

    after(function (done) {

        db.disconnect(function () {
            done();
        });
    });


    beforeEach(function (done) {

        var range = _.range(100);

        commonfunctions.getUsers(function (err, usrJson) {
            var type = usrJson.userType;
            async.each(range, function (e, cb) {
                User.create({
                    email: "email" + e + "@email.it",
                    type: type[_.random(0, type.length - 1)]
                }, function (err, val) {
                    if (err) throw err;
                    cb();
                });

            }, function (err) {
                done();
            });
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


    describe('Strict throw test', function(){

        it('must thow an exception for invalid USER Type', function(done){

            try {
                tokenTypes.create({type:"user",name:"valid"}, function (err, content) {
                    if (err) err.should.be.equal(null);
                    User.create({
                        email:"email@email.it",
                        type: "INVALID"
                    },function(err,val){
                        should.exist(err);
                        var errstring="err:"+ err;
                        errstring.indexOf("err:Error: 'INVALID' is not a valid value for user field `type`").should.be.greaterThan(-1);
                        done();
                    });
                });
            }catch(ex) {
                done();
            }
        });
    });

});
