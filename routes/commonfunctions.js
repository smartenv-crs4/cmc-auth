// @file jwtauth.js

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





exports.createUser = function(user, password, callb) {

    try {

        User.register(user, password, function (err, newuser) {
            // console.log("Creatig USER" + err);
            if (err) return callb("ERROR",500,{error:"signup_error",error_message : 'Unable to register user (err:' + err + ')'});
            callb(null,201,commonFunction.generateToken(newuser, "user"));
        });


    }catch (ex){
        //console.log("ECCCEPTIO "+ ex);
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
    var expires = moment().add(7, 'days').valueOf();
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

    // var encodedToken = JSON.stringify({
    //     apiKey : { token:token, expires: expires},
    //     refreshToken : {token:refreshToken, expires: expiresRt},
    //     userId : resource._id
    // });

    var encodedToken = {
        apiKey : { token:token, expires: expires},
        refreshToken : {token:refreshToken, expires: expiresRt},
        userId : resource._id
    };

    //console.log("############### " + token);

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

        //   console.log(decoded.iss);
        if (decoded.exp <= Date.now()) {
            return callb(401,{
                valid:false,
                error_message:"The access_token is expired"
            });

        }
        //debug(decoded);

        if(decoded.mode=="user"){ // è un token utente
            User.findById(decoded.iss,"enabled",function(err,element){
                console.log("USERA--> err:" + err + " element:" + element);
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
    //console.log("In Get My token #" + conf.MyMicroserviceToken +"#");



    async.series([
            function(callback){  // init Ms Token

                // if(conf.getParam("MyMicroserviceToken")==""){
                //     console.log("TOKEN NOT SETTED");
                //
                // }else  callback(null, 'one');
                ms.findOne({name:"authms"},function(err,val){
                    console.log("Find My TOKEN");
                    if (err) console.log("ERROR in creation token for this microservice " + err);
                    if(!val){
                        console.log("TOKEN not present");
                        var token=JSON.parse(commonFunction.generateMsToken("authms")).token;
                        ms.create({name:"authms",icon:"fa-unlock-alt", color:"panel-info",baseUrl:conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + conf.getParam("apiGwAuthBaseUrl") + "/" + conf.getParam("apiVersion"), token:token},function(err,val){
                            if (err) console.log("ERROR in token creation for this microservice " + err);
                            console.log("TOKEN created");
                            conf.setParam("MyMicroserviceToken",val.token);
                            callback(null, 'one');
                        })
                    }else{
                        conf.setParam("MyMicroserviceToken",val.token);
                        console.log("TOKEN SETTED " + util.inspect(conf.getConf()));
                        callback(null, 'one');
                    }
                });


            },
            function(callback){ // int MsType

               commonFunction.updateMicroservice(function(){
                   callback(null, 'two');
               });

            },
            function(callback){ // int MsType
                commonFunction.updateUsers(function(){
                    callback(null, 'three');
                });
            },
            function(callback){ // int MsType
                commonFunction.updateApp(function(){
                    callback(null, 'four');
                });
            }
        ],

        function(err, results){
            callb(conf);
        });
};



exports.updateMicroservice=function(clbk){
    ms.find(function(err,values){
        if(!err && values){
            conf.setParam("microserviceList",values);
            var msNameList=[];
            for (var msName in values){
                msNameList.push(values[msName].name);
            }
            //console.log("!!!!!!!!!!! MS TYPE " + msNameList);
            conf.setParam("msType",msNameList);
            clbk();



        }else clbk();
    });
};



exports.updateUsers=function(clbk){
    tokenTypes.find({type:"user"},function(err,values){
        if(!err && values){
            var tokenNameList=[];
            for (var users in values){
                tokenNameList.push(values[users].name);
            }
            //console.log("!!!!!!!!!!! MS TYPE " + msNameList);
            conf.setParam("userType",tokenNameList);
            clbk();
        }else clbk();
    });
};


exports.updateApp=function(clbk){
    tokenTypes.find({type:"app"},function(err,values){
        if(!err && values){
            var tokenNameList=[];
            for (var apps in values){
                tokenNameList.push(values[apps].name);
            }
            //console.log("!!!!!!!!!!! MS TYPE " + msNameList);
            conf.setParam("appType",tokenNameList);
            clbk();

        }else clbk();
    });
};



//exports.initMs = function() {
//
//                conf.MyMicroserviceToken="yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiQXV0aE1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzgwODM0NTQxMzQxfQ.gJkSUCAkqzIb52s2ITohj7vXx-EXpicObSaJ1uSgdog";
//                return(conf);
//};