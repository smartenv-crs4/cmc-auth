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
