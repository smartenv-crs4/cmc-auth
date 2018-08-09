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
var App = require('../models/apps').Apps;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var conf=require('../routes/configSettingManagment');
var util = require('util');
var commonfunctions=require('../routes/commonfunctions');

describe('MS Auth Model', function(){

    before(function (done) {

        db.connect("appsAuthModel", function () {
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

        commonfunctions.getApp(function (err, appJson) {
            var type = appJson.appType;
            async.each(range, function (e, cb) {


                App.create({
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
                    errstring.indexOf("err:Error: 'INVALID' is not a valid value for app field `type`").should.be.greaterThan(-1);
                    done();
                });
            }catch(ex) {
                done();
            }
        });
    });

    describe('Strict throw test', function(){

        it('must not thow an exception for invalid App Type', function(done){

            commonfunctions.getApp(function(err,appJson){
                var appType=appJson.appType;
                try {
                    App.create({
                        email:"email@email.it",
                        type: appType[0]
                    },function(err,val){
                        should.exist(val);
                        done();
                    });
                }catch(ex) {
                    done();
                }
            });


        });
    });

});
