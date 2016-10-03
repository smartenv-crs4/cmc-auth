var mongoose = require('mongoose');
var conf = require('../config').conf;
//var app = require('../app');
var commonFunctions=require('../routes/commonfunctions');
var util=require('util');
var async=require('async');
var dbUrl =  conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;
var tokenTypes=require('../models/userAndAppTypes').UserAndAppTypes;
var _=require('underscore');

var options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
	//,
    /*
	user: 'admin',
    pass: 'node'
	*/
};

exports.connect = function connect(testName,callback) {

    mongoose.connect(dbUrl, options, function (err, res) {

        if (err) {
            //console.log('Unable to connect to database ' + dbUrl);
            callback(err);

        }

        else {
            //console.log('Connected to database ' + dbUrl);
            //if not exixts crate default Admin user

            async.series([
                    function(clb){  //create admn default user
                        var Users=require('../models/users').User;
                        Users.findOne({type:conf.AdminDefaultUser.type},function(err,val){
                            console.log("############################### Admin User Creation ###############################");
                            console.log("Find default Admin User");
                            if (err) console.log("ERROR in creation admin default User " + err);
                            if(!val){
                                console.log("not default ADMIN, now I create it");
                                var user=JSON.parse(JSON.stringify(conf.AdminDefaultUser));
                                var psw=conf.AdminDefaultUser.password;
                                delete user['password'];
                                console.log("XXXXXXX PSW " + psw);
                                console.log("XXXXXXX User " + util.inspect(user));
                                commonFunctions.createUser(user,psw,function(err, stausCode, json){
                                    if(err) console.log("ERROR in creation Default admin user " + json.error_message);
                                    console.log("############################### Admin User Creation END ###############################");


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
                                console.log("############################### Admin User Creation END ###############################");
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
