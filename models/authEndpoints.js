var mongoose = require('mongoose');
var findAllFn = require('./metadata').findAll;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var conf=require('../routes/configSettingManagment');

var userType=conf.getParam("userType");
var appType=conf.getParam("appType");
var msType=conf.getParam("msType");




var tokensType= appType.concat(userType).concat(msType);



var AuthEndPointSchema = new Schema({
    URI: {type: String, index: true, required:true},
    method:{type: String, index: true, required:true, enum:["POST","GET","PUT","DELETE"]},
    name: {type: String, enum: msType, index: true, required:true},
    authToken: [{type: String, enum: tokensType, index: true, required:true}]
}, {strict: "throw"});



// Static method to retrieve resource WITH metadata
AuthEndPointSchema.statics.findAll = function (conditions, fields, options, callback) {
   return findAllFn(this, 'authendpoints', conditions, fields, options, callback);

};


AuthEndPointSchema.statics.UpdateAuthTokenSchema = function (callback){
    var userType=conf.getParam("userType");
    var appType=conf.getParam("appType");
    var msType=conf.getParam("msType");
    var tokensType= userType.concat(appType).concat(msType);
    //TODO REMOve
    console.log("!!!!!!!!!!!!!!!!!! AUYHTOKENTYPE:" + tokensType);
    AuthEndPointSchema.path('authToken', [{type: String, enum: tokensType, index: true, required:true}]);
    console.log("!!!!!!!!!!!!!!!!!! USERTYPE:" + msType);
    AuthEndPointSchema.path('name', [{type: String, enum: msType, index: true, required:true}]);
    return callback(null);

};

//AuthEndPointSchema.index({ URI: 1, method: 1},{ unique: true });

var AuthEndPoint = mongoose.model('authendpoints', AuthEndPointSchema);



module.exports.AuthEndPointSchema = AuthEndPointSchema;
module.exports.AuthEndPoint = AuthEndPoint;
