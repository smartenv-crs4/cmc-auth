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
var dbUrl = "mongodb://" + conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;
var tokenTypes=require('../models/userAndAppTypes').UserAndAppTypes;
var _=require('underscore');
var ms=require('../models/microservices').Microservice;
var dbTest=require('./dbTest');
var redisSync=require('../routes/redisSync');


var options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useMongoClient: true
    //,
    /*
	user: 'admin',
    pass: 'node'
	*/
};

function createUser(user,psw,clb){
    commonFunctions.createUser(user,psw,function(err, stausCode, json){
        if(err) console.log("ERROR in creation Default admin user " + json.error_message);
        console.log("############################### Admin User Creation END ###############################");
        clb(null,"one");
    });
}

exports.connect = function connect(testName,callback) {

    mongoose.connect(dbUrl, options, function (err, res) {

        if (err) {
            callback(err);

        }
        else {
            //if not exixts create default Admin user
            async.series([
                    function(clb){ // create  AutmMs token and load config params from DB
                        var tokenType = require('../models/userAndAppTypes').UserAndAppTypes;

                        async.parallel([
                                function(cl){ // create  AutmMs token and load config params from DB
                                    async.each(conf.testSettings.appType, function(item, callbackEnd) {

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
                                    async.each(conf.testSettings.userType, function(item, callbackEnd) {

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
                    },
                    function(clb){ // int MsType

                        dbTest.updateMicroserviceToTest(false,function(){
                            clb(null, 'two');
                        });

                    },
                    function(clb){ // int MsType
                        dbTest.updateUsersToTest(false,function(){
                            clb(null, 'three');
                        });
                    },
                    function(clb){ // int MsType
                        dbTest.updateAppToTest(false,function(){
                            clb(null, 'four');
                        });
                    },
                    function(clb){  //create admin default user
                        var Users=require('../models/users').User;
                        Users.findOne({type:conf.AdminDefaultUser.type},function(err,val){
                            if (err) console.log("ERROR in creation admin default User " + err);
                            if(!val){
                                console.log("1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                var user=JSON.parse(JSON.stringify(conf.AdminDefaultUser));
                                var psw=conf.AdminDefaultUser.password;
                                delete user['password'];

                                tokenTypes.find({name:conf.AdminDefaultUser.type, type:"user"},function(err,userT){
                                    if (err) console.log("ERROR in creation admin default User " + err);
                                    console.log("2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    if(_.isEmpty(userT)){
                                        console.log("3 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        tokenTypes.create({name:user.type, type:"user",super:true},function(err,userT){
                                            if (err) console.log("ERROR in creation admin default User " + err);
                                            console.log("4 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                            console.log("ADMIB TOKEN TYPE CREATED");
                                            dbTest.updateUsersToTest(false,function(){
                                                console.log("ADMIB TOKEN TYPE CREATED");
                                                console.log("5 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                                createUser(user,psw,clb);
                                            });
                                        });
                                    }else{
                                        dbTest.updateUsersToTest(false,function(){
                                            console.log("ADMIB TOKEN TYPE CREATED");
                                            console.log("6 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                            createUser(user,psw,clb);
                                        });
                                    }
                                });

                            }else{
                                console.log("7 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                clb(null,"one");
                            }
                        });
                    },
                
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






function publishToRedis(channel,message,forward){
    if(forward) {
        redisSync.publish(channel, message, function (err) {
            if (err) redisSync.useRedisMemCache = false;
        });
    }
}

function updateAdminUsers(publish,clbk){

    if(!clbk) {
        clbk = publish;
        publish=true;
    }
    if(redisSync.useRedisMemCache) {
        tokenTypes.find({super: true, type: "user"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var users in values) {
                    tokenNameList.push(values[users].name);
                }
                publishToRedis("superuser",tokenNameList,publish);
                // conf.setParam("superuser",tokenNameList);
                conf.superuser=tokenNameList;
                return clbk();
            } else return clbk();
        });
    }else {
        tokenTypes.find({super: true, type: "user"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var users in values) {
                    tokenNameList.push(values[users].name);
                }
               conf.superuser=tokenNameList;
               return clbk();
            } else return clbk();
        });
    }
}

exports.updateMicroserviceToTest=function(publish, clbk){

    if(!clbk) {
        clbk = publish;
        publish=true;
    }

    if(redisSync.useRedisMemCache) {
        ms.find(null,null,{sort:{_id:1}},function(err,values){
            if(!err && values){

                publishToRedis("microserviceList",values,publish);
                // conf.setParam("microserviceList",values);
                conf.microserviceList=values;
                var msNameList=[];
                for (var msName in values){
                    msNameList.push(values[msName].name);
                };

                publishToRedis("msType",msNameList,publish);
                // conf.setParam("msType",msNameList);
                conf.msType=msNameList;
                return clbk();
            }else return clbk();
        });
    }else{
        ms.find(null,null,{sort:{_id:1}},function(err,values){
            if(!err && values){
                conf.microserviceList=values;
                var msNameList=[];
                for (var msName in values){
                    msNameList.push(values[msName].name);
                }
                conf.msType=msNameList;
                clbk();
            }else clbk();
        });
    }



};



exports.updateUsersToTest=function(publish, clbk){

    if(!clbk) {
        clbk = publish;
        publish=true;
    }
    if(redisSync.useRedisMemCache) {
        tokenTypes.find({type: "user"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var users in values) {
                    tokenNameList.push(values[users].name);
                }
                publishToRedis("userType",tokenNameList,publish);
                // conf.setParam("userType", tokenNameList);
                conf.userType=tokenNameList;
                updateAdminUsers(publish,clbk);
            } else updateAdminUsers(publish,clbk);
        });
    }else {
        tokenTypes.find({type: "user"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var users in values) {
                    tokenNameList.push(values[users].name);
                }
                conf.userType = tokenNameList;
                clbk();
            } else clbk();
        });
    }
};


exports.updateAppToTest=function(publish, clbk){

    if(!clbk) {
        clbk = publish;
        publish=true;
    }
    if(redisSync.useRedisMemCache) {
        tokenTypes.find({type: "app"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var apps in values) {
                    tokenNameList.push(values[apps].name);
                }
                publishToRedis("appType",tokenNameList,publish);
                // conf.setParam("appType", tokenNameList);
                conf.appType=tokenNameList;
                return clbk();

            } else return clbk();
        });
    }else {
        tokenTypes.find({type: "app"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var apps in values) {
                    tokenNameList.push(values[apps].name);
                }
                conf.appType = tokenNameList;
                clbk();

            } else clbk();
        });
    }
};
