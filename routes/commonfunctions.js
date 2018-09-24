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

var moment = require('moment');
var jwt = require('jwt-simple');
var async=require('async');
var commonFunction=require('./commonfunctions');
var conf=require('../routes/configSettingManagment');
var util=require('util');
var App = require('../models/apps').Apps;
var User = require('../models/users').User;
var ms=require('../models/microservices').Microservice;
var tokenTypes=require('../models/userAndAppTypes').UserAndAppTypes;
var msAuth=require('../models/authEndpoints').AuthEndPoint;
var _=require('underscore');
var tokenLife=conf.getParam("tokenLife");
var redisSync=require('../routes/redisSync');


exports.createUser = function(user, password, callb) {

    try {
        User.register(user, password, function (err, newuser) {
            if (err) return callb("ERROR",500,{error:"signup_error",error_message : 'Unable to register user (err:' + err + ')'});
            callb(null,201,commonFunction.generateToken(newuser, "user"));
        });


    }catch (ex){
        return callb("ERROR",500,{error:"signup_error",error_message : 'Unable to register user (err:' + ex + ')'});
    }
    
};


exports.generateMsToken= function (type){
    "use strict";
    var expires = moment().add(10, 'years').valueOf();
    var secret = require('../app').get('jwtTokenSecret');

    var token = jwt.encode({
        mode:"ms",
        iss: "not used fo ms",
        email: "not used fo ms",
        type: type,
        enabled: true,
        exp: expires
    }, secret);


    var encodedToken = JSON.stringify({ token:token});
    return encodedToken;
};


exports.generateToken= function (resource,mode){
    "use strict";

     var unit= tokenLife.unit || 'days';
     var value= parseInt(tokenLife.value) || 7;

    var expires = moment().add(value, unit).valueOf();
    var secret = require('../app').get('jwtTokenSecret');

    var token = jwt.encode({
        mode:mode,
        iss: resource._id,
        email: resource.email,
        type: resource.type,
        enabled: resource.enabled,
        exp: expires
    }, secret);

    var expiresRt = moment().add(14, 'days').valueOf();
    var refreshToken = jwt.encode({
        mode:mode,
        iss: resource._id,
        email: resource.email,
        type: resource.type,
        enabled: resource.enabled,
        exp: expiresRt
    }, secret);


    var encodedToken = {
        apiKey : { token:token, expires: expires},
        refreshToken : {token:refreshToken, expires: expiresRt},
        userId : resource._id
    };


    return encodedToken;
};




function bundleToken(decoded,callback){
    var decode_results= {
        valid: true,
        token: {
            _id: decoded.iss,
            email: decoded.email,
            type: decoded.type,
            enabled: decoded.enabled,
            mode: decoded.mode,
            exp: decoded.exp
        }
    };
    callback(null,decode_results);
}

exports.decode=function(token,callb){


    if (token) {
        try {
            var decoded = jwt.decode(token, require('../app').get('jwtTokenSecret'));
        } catch (err) {
            return callb(400,{
                valid:false,
                error_message:"The access_token is invalid or malformed"
            });
        }


        if (decoded.exp <= Date.now()) {
            return callb(401,{
                valid:false,
                error_message:"The access_token is expired"
            });

        }
        //debug(decoded);

        if(decoded.mode=="user"){ // è un token utente
            User.findById(decoded.iss,"enabled",function(err,element){
                if(err){
                    return callb(500,{
                        valid:false,
                        error_message:err
                    });
                }
                else{
                    if(!element) {
                        return callb(401,{
                            valid:false,
                            error_message:"The access_token is not associated to any user"
                        });
                    } else if((!element.enabled)){
                        return callb(401,{
                            valid:false,
                            error_message:"The access_token is associated to unchecked or not enabled user"
                        });
                    }else return bundleToken(decoded,callb);
                }
            });

        }else{ // è un token developer ?
            if(decoded.mode=="developer"){
                App.findById(decoded.iss,"enabled",function(err,element){
                    if(err){
                        return callb(500,{
                            valid:false,
                            error_message:err
                        });
                    }
                    else{
                        if(!element) {
                            return callb(401,{
                                valid:false,
                                error_message:"The access_token is not associated to any APP"
                            });
                        } else if((!element.enabled)){
                            return callb(401,{
                                valid:false,
                                error_message:"The access_token is associated to unchecked or not enabled APP"
                            });
                        }else return bundleToken(decoded,callb);
                    }
                });
            }else{// è un token di tipo Microservice
                bundleToken(decoded,callb);
            }

        }
    } else {
        callb(400,{
            valid:false,
            error_message:"The access_token is required"
        });
    }
};


exports.initMs = function(callb) {


    var authmsName= conf.getParam("authMsName") || "authms";

    async.series([
            function(callback){  // init Ms Token


                ms.findOne({name:authmsName},function(err,val){
                    if (err) console.log("ERROR in creation token for this microservice " + err);
                    if(!val){
                        var token=JSON.parse(commonFunction.generateMsToken(authmsName)).token;
                        ms.create({name:authmsName,icon:"fa-unlock-alt", color:"panel-info",baseUrl:conf.getParam("authUrl"), token:token},function(err,val){
                            if (err) console.log("ERROR in token creation for this microservice " + err);
                            conf.setParam("MyMicroserviceToken",val.token);
                            callback(null, 'one');
                        })
                    }else{
                        conf.setParam("MyMicroserviceToken",val.token);
                        callback(null, 'one');
                    }
                });


            },
            function(callback){ // int MsType

               commonFunction.updateMicroservice(false,function(){
                   callback(null, 'two');
               });

            },
            function(callback){ // int MsType
                commonFunction.updateUsers(false,function(){
                    callback(null, 'three');
                });
            },
            function(callback){ // int MsType
                commonFunction.updateApp(false,function(){
                    callback(null, 'four');
                });
            }
        ],

        function(err, results){
            callb(conf);
        });
};

function publishToRedis(channel,message,forward){
    if(forward) {
        redisSync.publish(channel, message, function (err) {
            if (err) redisSync.useRedisMemCache = false;
        });
    }
}

exports.updateMicroservice=function(publish,clbk){
    if(!clbk) {
        clbk = publish;
        publish=true;
    }

    if(redisSync.useRedisMemCache) {
        ms.find(null,null,{sort:{_id:1}},function(err,values){
            if(!err && values){

                publishToRedis(conf.getParam("redisChannels").microserviceListChannel,values,publish);
                conf.setParam("microserviceList",values);
                var msNameList=[];
                for (var msName in values){
                    msNameList.push(values[msName].name);
                };

                publishToRedis(conf.getParam("redisChannels").msTypeChannel,msNameList,publish);
                conf.setParam("msType",msNameList);
                return clbk();
            }else return clbk();
        });
    }else return clbk();
};

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
                publishToRedis(conf.getParam("redisChannels").superuserChannel,tokenNameList,publish);
                conf.setParam("superuser", tokenNameList);
                return clbk();
            } else return clbk();
        });
    }else return clbk();
}

exports.updateUsers=function(publish,clbk){
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
                publishToRedis(conf.getParam("redisChannels").userTypeChannel,tokenNameList,publish);
                conf.setParam("userType", tokenNameList);
                updateAdminUsers(publish,clbk);
            } else updateAdminUsers(publish,clbk);
        });
    }else return clbk();
};



function updateAdminApps(publish,clbk){

    if(!clbk) {
        clbk = publish;
        publish=true;
    }
    if(redisSync.useRedisMemCache) {
        tokenTypes.find({super: true, type: "app"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var users in values) {
                    tokenNameList.push(values[users].name);
                }
                publishToRedis(conf.getParam("redisChannels").superappChannel,tokenNameList,publish);
                conf.setParam("superapp", tokenNameList);
                return clbk();
            } else return clbk();
        });
    }else return clbk();
}

exports.updateApp=function(publish,clbk){
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
                publishToRedis(conf.getParam("redisChannels").appTypeChannel,tokenNameList,publish);
                conf.setParam("appType", tokenNameList);
                updateAdminApps(publish,clbk);
            } else updateAdminApps(publish,clbk);
        });
    }else return clbk();
};


exports.getAdminTokenTypes=function(clbk){

    if(redisSync.useRedisMemCache) {
        return clbk(null, {superuser: conf.getParam("superuser"), redisChannel:conf.getParam("redisChannels").superuserChannel});
    }else{
        var list = [];
        tokenTypes.find({super: true, type: "user"}, function (err, values) {
            if (err) return clbk(500, {error: "InternalError", error_message: "Internal Error " + err});
            async.each(values, function (val, clb) {
                list.push(val.name);
                return clb();
            }, function (err) {
                return clbk(null, {superuser: list});
            });
        });
    }
};


exports.getAdminAppTokenTypes=function(clbk){

    if(redisSync.useRedisMemCache) {
        return clbk(null, {superapp: conf.getParam("superapp"), redisChannel:conf.getParam("redisChannels").superappChannel});
    }else{
        var list = [];
        tokenTypes.find({super: true, type: "app"}, function (err, values) {
            if (err) return clbk(500, {error: "InternalError", error_message: "Internal Error " + err});
            async.each(values, function (val, clb) {
                list.push(val.name);
                return clb();
            }, function (err) {
                return clbk(null, {superapp: list});
            });
        });
    }
};

exports.getMicroservice=function(clbk){
    if(redisSync.useRedisMemCache) {
        return clbk(null, {microserviceList: conf.getParam("microserviceList"), msType: conf.getParam("msType")});
    }else {
        ms.find(null, null, {sort: {_id: 1}}, function (err, values) {
            if (!err && values) {
                var msNameList = [];
                for (var msName in values) {
                    msNameList.push(values[msName].name);
                }
                return clbk(null, {microserviceList: values, msType: msNameList});
            } else return clbk(err, {microserviceList: [], msType: []});
        });
    }
};



exports.getUsers=function(clbk){
    if(redisSync.useRedisMemCache) {
        return clbk(null, {userType: conf.getParam("userType")});
    }else {
        tokenTypes.find({type: "user"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var users in values) {
                    tokenNameList.push(values[users].name);
                }
                return clbk(null, {userType: tokenNameList});
            } else return clbk(err, {userType: []});
        });
    }
};


exports.getApp=function(clbk){
    if(redisSync.useRedisMemCache) {
        return clbk(null, {appType: conf.getParam("appType")});
    }else {
        tokenTypes.find({type: "app"}, function (err, values) {
            if (!err && values) {
                var tokenNameList = [];
                for (var apps in values) {
                    tokenNameList.push(values[apps].name);
                }
                clbk(null, {appType: tokenNameList});
            } else clbk(err, {appType: []});
        });
    }
};
