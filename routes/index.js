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


var express = require('express');
var router = express.Router();
var commonfunctions=require('./commonfunctions');
var request=require("request");
var _ = require('underscore')._;
var conf=require('../routes/configSettingManagment');
var iconsList=conf.getParam("iconsList");
var commonfunctions=require('./commonfunctions');

router.get('/main', function(req, res) {
    var action=req.signedCookies.action || null;

    if(action=="log") {

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        var adminToken=req.query.adminToken || null;

        commonfunctions.getMicroservice(function(err,msJson){
            res.render('main', {
                MicroSL: msJson.microserviceList,
                myUrl: conf.getParam("authUrl"),
                myToken: conf.getParam("MyMicroserviceToken"),
                iconsList: iconsList,
                adminToken:adminToken,
                authmsName:conf.getParam("authMsName") || "authms"
            });
        });
    }
    else {
        res.status(401).send({error:"Unauthorized", error_message:"You are not authorized to access this resource"});
    }
});

/* GET configuration page. */
router.get('/configure', function(req, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('start', {read:"No"});
});

/* GET login page. */
router.get('/login', function(req, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('login', {
        next: conf.getParam("authUrl"),
        at: conf.getParam("MyMicroserviceToken")
    });
});


function renderLoginError(res,error_message){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('login', {
        next: conf.getParam("authUrl"),
        at: conf.getParam("MyMicroserviceToken"),
        error_message: error_message
    });
}


function renderConfigurePage(res,access_token){
    res.cookie("action", "log", {signed: true});
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('start', {read: "Yes", adminToken: access_token});
}

/* POST configuration page. */
router.post('/configure', function(req, res) {

    var ms = {
        "username": req.body.username,
        "password": req.body.password
    };
    var userBody = JSON.stringify(ms);

    request.post({
        url: conf.getParam("authUrl") + "/authuser/signin",
        body: userBody,
        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.getParam("MyMicroserviceToken")}
    }, function (error, response,body) {
        try {
            respb = JSON.parse(body);
            if (respb.error_message) {
               return renderLoginError(res,respb.error_message);
            }
            else {
                commonfunctions.decode(respb.apiKey.token,function(err,decoded){
                    if(err){
                        return renderLoginError(res,err);
                    }else{
                        if(decoded.valid){
                            var adminUser=conf.getParam("WhoUsersCanLoginToConfigure");

                            if(adminUser.indexOf("all")>=0){
                                //get all admin tokentypes
                                commonfunctions.getAdminTokenTypes(function(err,data){
                                    if(err) return renderLoginError(res,err.error_message);
                                    if(data.superuser.indexOf(decoded.token.type)>=0){
                                        return renderConfigurePage(res,respb.apiKey.token)
                                    }else{
                                        return renderLoginError(res,"Not Authorised: You are not authorised to access to configure");
                                    }
                                });
                            }else{
                                if(adminUser.indexOf(decoded.token.type)>=0){
                                    return renderConfigurePage(res,respb.apiKey.token)
                                }else{
                                    return renderLoginError(res,"Not Authorised: You are not authorised to access to configure");
                                }
                            }

                        }else {
                            return renderLoginError(res,"Internal Error due to Not Valid access_token after Login");
                        }
                    }
                });
            }
        }catch (ex){
            return renderLoginError(res,ex);
        }
    });
});

/* POST logout page. */
router.post('/logout', function(req, res) {
    res.clearCookie("action");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('start', {read:"No"});
});

// /* GET home page. */
// router.post('/logout', function(req, res) {
//     res.clearCookie("action");
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.render('login', {
//         next: conf.getParam("myMicroserviceBaseUrl"),
//         at: conf.getParam("MyMicroserviceToken")
//     });
// });

/* GET home page. */
router.get('/', function(req, res) {
 res.render('index', { title: 'CMC Auth API Microservice dev' });
});

/* GET environment info page. */
router.get('/env', function(req, res) {
    var env;
    if (process.env['NODE_ENV'] === 'dev')
        env='dev';
    else
        env='production';

    res.status(200).send({env:env});
});






module.exports = router;