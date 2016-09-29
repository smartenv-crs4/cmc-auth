var util = require('util');
var conf = require('../config').conf;
var _ = require('underscore')._;





//It wraps the find() method to include metadata

exports.findAll = function findAll(schema, entityName, conditions, fields, options, callback) {

    var opt = options ? options : {skip: conf.skip, limit: conf.limit};



    schema.find(conditions, fields, opt, function (err, result) {



        if (!err) {
            schema.count(conditions, function (err, count) {

                if (!err) {

                    var entities = entityName ? entityName : 'entities';
//                           console.log(entities);
//                           console.log(count);
                    var results = {
                        _metadata: {
                            totalCount: count,
                            skip: opt.skip,
                            limit: opt.limit

                        }
                    };

                   

                    results[entities] = result;

                    callback(null, results);

                }
                else {
                    callback(err, null);
                }


            });
        }
        else {
            callback(err, null);
        }


    });


};

//It wraps the find() + populate() method to include metadata

exports.findAllPopulated = function findAllPopulated(schema, entityName, conditions, fields, options, populate, callback) {

    var opt = options ? options : {skip: conf.skip, limit: conf.limit};
    if (!populate || _.isEmpty(populate)) throw new Error("Populate cannot be empty");
    else {
        var query = schema.find(conditions, fields, opt);

        //populate
        _.each(_.keys(populate), function (p, index) {

            // console.log(p);
            query = query.populate(p, populate[p].join(' '));

        });


        query.exec(function (err, result) {

            if (!err) {
                schema.count(conditions, function (err, count) {

                    if (!err) {

                        var entities = entityName ? entityName : 'entities';
                        //                           console.log(entities);
                        //                           console.log(count);
                        var results = {
                            _metadata: {
                                totalCount: count,
                                skip: opt.skip,
                                limit: opt.limit

                            }
                        };

                        results[entities] = result;

                        callback(null, results);

                    }
                    else {
                        callback(err, null);
                    }


                });
            }
            else {
                callback(err, null);
            }


        });
    }
};





