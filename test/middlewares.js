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
var middlewares = require("../routes/middlewares");

describe('Middleware', function(){

  describe('parseFields', function(){
    it('must return a space separated string of strings', function(){

      var parseFields = middlewares.parseFields;

      var req = {"query":{"fields":'name,id,date'}};

      parseFields(req,null,function(){});
      req.dbQueryFields.should.be.equal("name id date");

    });
  });

  describe('parsePagination', function(){
    it('must return an object with skip and limit set', function(){

      var parsePagination = middlewares.parsePagination;

      var req = {"query":{"skip":'15', "limit":"50"}};

      parsePagination(req,null,function(){});
      req.dbPagination.skip.should.be.equal(15);
      req.dbPagination.limit.should.be.equal(50);

    });
  });

  describe('parsePagination with limit > max limit', function(){
    it('must return an object with skip set and limit set to max (default) value', function(){

      var parsePagination = middlewares.parsePagination;

      var req = {"query":{"skip":'15', "limit":"1000"}};

      parsePagination(req,null,function(){});
      req.dbPagination.skip.should.be.equal(15);
      req.dbPagination.limit.should.be.equal(50);

    });
  });


    describe('parsePagination with limit not parsable', function(){
        it('must return an object with skip set and limit set to max (default) value', function(){

            var parsePagination = middlewares.parsePagination;

            var req = {"query":{"skip":'15', "limit": "not parsable string"}};

            parsePagination(req,null,function(){});
            req.dbPagination.skip.should.be.equal(15);
            req.dbPagination.limit.should.be.equal(50);

        });
    });



    describe('parsePagination with skip not parsable', function(){
        it('must return an object with skip set to 0 (default) and limit set to max (default) value', function(){

            var parsePagination = middlewares.parsePagination;

            var req = {"query":{"skip":"not parsable to int string", "limit": "50"}};

            parsePagination(req,null,function(){});
            req.dbPagination.skip.should.be.equal(0);
            req.dbPagination.limit.should.be.equal(50);

        });
    });

});
