var express = require('express');
var router = express.Router();
var microservices = require('../models/microservices').Microservice;
var authEnpoints = require('../models/authEndpoints').AuthEndPoint;
var jwtMiddle = require('./jwtauth');
var commonfunctions=require('./commonfunctions');
var request=require("request");
var _ = require('underscore')._;
var conf=require('../routes/configSettingManagment');
var iconsList=conf.getParam("iconsList");

router.get('/main', function(req, res) {
    var action=req.signedCookies.action || null;

    if(action=="log") {

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
        var gwVersion=conf.getParam("apiVersion");
        var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
        gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
        var adminToken=req.query.adminToken || null;
        res.render('main', {
            MicroSL: conf.getParam("microserviceList"),
            myUrl: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
            myToken: conf.getParam("MyMicroserviceToken"),
            iconsList: iconsList,
            adminToken:adminToken,
            authmsName:conf.getParam("authMsName") || "authms"
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
    var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
    var gwVersion=conf.getParam("apiVersion");
    var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
    gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
    res.render('login', {
        next: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
        at: conf.getParam("MyMicroserviceToken")
    });
});

// /* GET home page. */
// router.get('/configure', function(req, res) {
//
// var action=req.signedCookies.action || null;
//
//  console.log("XXXXXXXXXXXXXXX " + action + " XXXXXXXXXXXXXX");
//
//  console.log("Rendering " + conf.getParam("msType"));
//
//
//     if(action=="log") {
//
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.render('main', {
//             MicroSL: conf.getParam("microserviceList"),
//             myUrl: conf.getParam("myMicroserviceBaseUrl"),
//             myToken: conf.getParam("MyMicroserviceToken"),
//             iconsList: iconsList
//         });
//     }
//     else {
//         //res.cookie("action","log");
//         console.log("LOGIN");
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.render('login', {
//             next: conf.getParam("myMicroserviceBaseUrl"),
//             at: conf.getParam("MyMicroserviceToken")
//         });
//     }
// });

/* POST configuration page. */
router.post('/configure', function(req, res) {

    var ms = {
        "username": req.body.username,
        "password": req.body.password
    };
    var userBody = JSON.stringify(ms);
    // console.log("BODY " + userBody);

    var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
    var gwVersion=conf.getParam("apiVersion");
    var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
    gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
    request.post({
        url: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf + "/authuser/signin",
        body: userBody,
        headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.getParam("MyMicroserviceToken")}
    }, function (error, response,body) {
        console.log(body);
        respb=JSON.parse(body);
        if (respb.error_message){
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
            var gwVersion=conf.getParam("apiVersion");
            var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
            gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
            res.render('login', {
                next: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
                at: conf.getParam("MyMicroserviceToken"),
                error_message:respb.error_message
            });
        }
        else {
            res.cookie("action","log",{ signed: true });
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.render('start', {read:"Yes", adminToken:respb.apiKey.token});
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
 res.render('index', { title: 'Caport2020 Auth API Microservice dev' });
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