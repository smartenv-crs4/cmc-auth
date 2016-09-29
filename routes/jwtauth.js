// @file jwtauth.js



//var conf=require('../routes/configSettingManagment');


var util=require('util');
var commonfunctions=require('./commonfunctions');

var conf=require('../routes/configSettingManagment');

exports.decodeToken = function(req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token); // || req.headers['x-access-token'];
    if (req.headers['authorization']) {
        var value = req.headers['authorization'];
        header = value.split(" ");
        if (header.length == 2)
            if (header[0] == "Bearer") {
                token = header[1];
            }
    }

    console.log("DECODE TOKEN");

    commonfunctions.decode(token,function(err,decoded){
        if(err){
            var errcode;
            //TODO get error code string es 401=notAuthorized e set it in error:
           res.status(err).send({error:err,error_message:decoded.error_message});
        }else{
            //console.log("TOKEN DECODED");
            req.decode_results=decoded.token;
            next();
        }
    });
};

//
//exports.getToken = function(req, res, next) {
//
//    var token = ((req.body && req.body.refresh_token) || (req.query && req.query.refresh_token))||((req.body && req.body.decode_token) || (req.query && req.query.decode_token)); // || req.headers['x-access-token'];
//
//
//    if (token) {
//        try {
//            var decoded = jwt.decode(token, require('../app').get('jwtTokenSecret'));
//        } catch (err) {
//            req.deode_results={
//                valid:false,
//                error_description:"The access is invalid or malformed"
//            };
//            return next();
//        }
//
//         //   console.log(decoded.iss);
//            if (decoded.exp <= Date.now()) {
//
//                req.decode_results={
//                    valid:false,
//                    error_description:"The access token expired"
//                };
//                return next();
//            }
//            //debug(decoded);
//
//        if(decoded.mode=="user"){ // è un token utente
//            MS.findById(decoded.iss,"enabled",function(err,element){
//                console.log("MS--> err:" + err + " element:" + element);
//                if(err){
//                    req.decode_results={
//                        valid:false,
//                        error_description:err
//                    };
//                    return next();
//
//                }
//                else{
//                    if(!element) {
//                        req.decode_results={
//                            valid:false,
//                            error_description:"The access token is not associated to any user"
//                        };
//                        return next();
//                    } else if((!element.enabled)){
//                        req.decode_results={
//                            valid:false,
//                            error_description:"The access token is associated to unchecked or not enabled  user"
//                        };
//                        return next();
//                    }else bundleToken(req,decoded,next);
//                }
//            });
//
//        }else{ // è un token developer
//            MS.findById(decoded.iss,"enabled",function(err,element){
//                if(err){
//                    req.decode_results={
//                        valid:false,
//                        error_description:err
//                    };
//                    return next();
//
//                }
//                else{
//                    if(!element) {
//                        req.decode_results={
//                            valid:false,
//                            error_description:"The access token is not associated to any MS"
//                        };
//                        return next();
//                    } else if((!element.enabled)){
//                        req.decode_results={
//                            valid:false,
//                            error_description:"The access token is associated to unchecked or not enabled MS"
//                        };
//                        return next();
//                    }else bundleToken(req,decoded,next);
//                }
//            });
//        }
//    } else {
//        req.decode_results={
//            valid:false,
//            error_description:"The access token is required"
//        };
//        next();
//    }
//};


exports.ensureIsMicroservice = function(req, res, next) {

    console.log("ensure is MS");

    var token = req.decode_results;
    var exampleUrl = "http://cp2020.crs4.it/";

    console.log("TOKEN TYPE " + token.type);

        if (!(conf.getParam("msType").indexOf(token.type)>=0)) { // if is not a microservice token
            return res.status(401)
                .set({'WWW-Authenticate': 'Bearer realm=' + exampleUrl + ', error="invalid_token", error_message="The access token is not a valid microservice Auth Token"'})
                .send({error: "invalid_token", error_message: "The access token is not a valid microservice Token"});
        } else{
            console.log("VALID MS TOKEN");
            return next();
        }

};



//exports.ensureIsMicroservice = function(req, res, next) {
//
//
//    console.log("body SGUP middle:"+util.inspect(req.body));
//
//    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token); // || req.headers['x-access-token'];
//
//
//
//    if (req.headers['authorization']) {
//        var value = req.headers['authorization'];
//        header = value.split(" ");
//        if (header.length == 2)
//            if (header[0] == "Bearer") {
//                token = header[1];
//            }
//    }
//
//    var exampleUrl = "http://cp2020.crs4.it/";
//
//    if (token) {
//
//
//        //   console.log(decoded.iss);
//        if (token!=conf.MyMicroserviceToken) {
//            return res.status(401)
//                .set({'WWW-Authenticate': 'Bearer realm=' + exampleUrl + ', error="invalid_token", error_message="The access token is not valid"'})
//                .send({error: "invalid_token", error_message: "Unauthorized: The access token is not valid"});
//        }
//        //debug(decoded);
//        next();
//
//    } else {
//        res.status(401)
//            .set({'WWW-Authenticate': 'Bearer realm=' + exampleUrl + ', error="invalid_request", error_message="The access token is required"'})
//            .send({
//                error: "invalid_request",
//                error_message: "Unauthorized: Access token required, you are not allowed to use the resource"
//            });
//    }
//};