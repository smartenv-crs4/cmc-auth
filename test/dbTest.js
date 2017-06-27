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

var mongoose = require('mongoose');
var conf = require('../config').conf;
var commonFunctions=require('../routes/commonfunctions');
var util=require('util');
var async=require('async');
var dbUrl =  conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;
var tokenTypes=require('../models/userAndAppTypes').UserAndAppTypes;
var _=require('underscore');

var options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
    /*
	user: 'admin',
    pass: 'node'
	*/
};

exports.connect = function connect(testName,callback) {

    mongoose.connect(dbUrl, options, function (err, res) {

        if (err) {
            callback(err);

        }
        else {
            //if not exixts create default Admin user
            async.series([
                    function(clb){  //create admin default user
                        var Users=require('../models/users').User;
                        Users.findOne({type:conf.AdminDefaultUser.type},function(err,val){
                            if (err) console.log("ERROR in creation admin default User " + err);
                            if(!val){
                                var user=JSON.parse(JSON.stringify(conf.AdminDefaultUser));
                                var psw=conf.AdminDefaultUser.password;
                                delete user['password'];
                                commonFunctions.createUser(user,psw,function(err, stausCode, json){
                                    if(err) console.log("ERROR in creation Default admin user " + json.error_message);
                                        tokenTypes.find({name:conf.AdminDefaultUser.type, type:"user"},function(err,userT){
                                            if (err) console.log("ERROR in creation admin default User " + err);
                                            if(_.isEmpty(userT)){
                                                tokenTypes.create({name:user.type, type:"user",super:true},function(err,userT){
                                                    if (err) console.log("ERROR in creation admin default User " + err);
                                                    clb(null,"one");
                                                });
                                            }else{
                                                clb(null,"one");
                                            }
                                        });
                                });
                            }else{
                                clb(null,"one");
                            }
                        });
                    },
                    function(clb){ // create  AutmMs token and load config params from DB
                        var tokenType = require('../models/userAndAppTypes').UserAndAppTypes;

                        async.parallel([
                                function(cl){ // create  AutmMs token and load config params from DB
                                    async.each(conf.appType, function(item, callbackEnd) {

                                        try{
                                            tokenType.create({name:item,type:"app"},function(err,va){
                                                callbackEnd();
                                            });
                                        }catch (ex){
                                            callbackEnd();
                                        }

                                    }, function(err) {
                                        cl();
                                    });
                                },
                                function(cl){ // create  AutmMs token and load config params from DB
                                    async.each(conf.userType, function(item, callbackEnd) {

                                        try{
                                            tokenType.create({name:item,type:"user"},function(err,va){
                                                callbackEnd();
                                            });
                                        }catch (ex){
                                           callbackEnd();
                                        }

                                    }, function(err) {
                                        cl();
                                    });
                                }
                        ],
                        function(err,resp){
                            clb(null,"two");
                        });
                    },
                    function(clb){ // create  AutmMs token and load config params from DB
                        commonFunctions.initMs(function(cnf){
                            clb(null,"three");
                        });
                    }
                
                ],
                function(err, results){
                    callback();
                });
        }
    });
};


exports.disconnect = function disconnect(callback) {

    var tokenType = require('../models/userAndAppTypes').UserAndAppTypes;

    tokenType.remove({},function(err,values){
        mongoose.disconnect(callback);
    });



};
