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
//var app = require('../app');
var commonFunctions=require('../routes/commonfunctions');
var util=require('util');
var async=require('async');
var dbAuth= conf.dbAuth.user ? conf.dbAuth.user + ":" + conf.dbAuth.psw + "@" : "";
var authSource= conf.dbAuth.user ? "?authSource=admin" : "";
var dbUrl =  "mongodb://" + dbAuth + conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName + authSource;
var tokenTypes=require('../models/userAndAppTypes').UserAndAppTypes;
var _=require('underscore');

var options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
    useNewUrlParser: true
};

// var options = {
//     keepAlive: 1,
//     connectTimeoutMS: 30000,
//     useMongoClient: true
// 	//,
//     /*
// 	user: 'admin',
//     pass: 'node'
// 	*/
// };






function createUser(user,psw,clb){
    commonFunctions.createUser(user,psw,function(err, stausCode, json){
        if(err) console.log("ERROR in creation Default admin user " + json.error_message);
        console.log("############################### Admin User Creation END ###############################");
        clb(null,"one");
    });
}

exports.connect = function connect(callback) {

    console.log("Database string connection: ", dbUrl);

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
                        var Users=require('./users').User;
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
                                tokenTypes.find({name:conf.AdminDefaultUser.type, type:"user"},function(err,userT){
                                    if (err) console.log("ERROR in creation admin default User " + err);
                                    if(_.isEmpty(userT)){
                                        tokenTypes.create({name:user.type, type:"user",super:true},function(err,userT){
                                            if (err) console.log("ERROR in creation admin default User " + err);
                                            commonFunctions.updateUsers(false,function(){
                                                console.log("ADMIB TOKEN TYPE CREATED");
                                                createUser(user,psw,clb);
                                            });
                                        });
                                    }else{
                                        createUser(user,psw,clb);
                                    }
                                });

                            }else{
                                console.log("############################### Admin User Creation END ###############################");
                                clb(null,"one");
                            }
                        });
                    },
                    function(clb){ // create  AutmMs token and load config params from DB
                        commonFunctions.initMs(function(cnf){
                            clb(null,"two");
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

    mongoose.disconnect(callback);
};
