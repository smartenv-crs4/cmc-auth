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



var commonfunctions=require('./commonfunctions');
var redis=require('redis');
var conf=require('../routes/configSettingManagment');
var TokenManagment={
    "useRedisMemCache":false,
    "unsubscribe":function(){
    },
    "quit":function(){

    },
    "publish":function(channel,message){

    },
    "setup":function(){

        var redisChannels={
            superuserChannel:"superuser",
            superappChannel:"superapp",
            microserviceListChannel:"microserviceList",
            msTypeChannel:"msType",
            userTypeChannel:"userType",
            appTypeChannel:"appType"
        };

        conf.setParam("redisChannels",redisChannels);

        var redisConf=conf.getParam("redisCache");
        if(!redisConf.password)
            delete redisConf.password;

        var redisClient = redis.createClient(redisConf);
        var redisClientPublisher = redis.createClient(redisConf);
        redisClient.on("ready", function (err) {

            redisClient.subscribe(redisChannels.superuserChannel);
            redisClient.subscribe(redisChannels.microserviceListChannel);
            redisClient.subscribe(redisChannels.msTypeChannel);
            redisClient.subscribe(redisChannels.userTypeChannel);
            redisClient.subscribe(redisChannels.appTypeChannel);

            TokenManagment.unsubscribe=function(){
                redisClient.unsubscribe(redisChannels.superuserChannel);
                redisClient.unsubscribe(redisChannels.microserviceListChannel);
                redisClient.unsubscribe(redisChannels.msTypeChannel);
                redisClient.unsubscribe(redisChannels.userTypeChannel);
                redisClient.unsubscribe(redisChannels.appTypeChannel);
            };
            TokenManagment.quit=function(){
                redisClient.quit();
            };
            TokenManagment.publish=function(channel,message,cb){
                redisClientPublisher.publish(channel,JSON.stringify(message),cb);
            };
            TokenManagment.useRedisMemCache=true;

        });

        redisClient.on("error", function (err) {
            console.log("Error in redisSync ----> " + err);
        });

        redisClient.on("subscribe", function (channel, count) {
            console.log("Subscribed to Redis channel " + channel);
        });

        redisClient.on("message", function (channel, message) {
            console.log("**********************************************");
            console.log("messagge on channel " + channel + ": " + message);
            console.log("**********************************************");
            TokenManagment.useRedisMemCache=true;
            conf.setParam(channel,JSON.parse(message));
        });
    }
};


module.exports = TokenManagment;



