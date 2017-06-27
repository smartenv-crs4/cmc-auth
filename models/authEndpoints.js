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
var findAllFn = require('./metadata').findAll;
var _=require('underscore');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var conf=require('../routes/configSettingManagment');


var AuthEndPointSchema = new Schema({
    URI: {type: String, index: true, required:true},
    method:{type: String, index: true, required:true, enum:["POST","GET","PUT","DELETE"]},
    name: {type: String, index: true, required:true},
    authToken: [{type: String, index: true, required:true}]
}, {strict: "throw"});



// Static method to retrieve resource WITH metadata
AuthEndPointSchema.statics.findAll = function (conditions, fields, options, callback) {
   return findAllFn(this, 'authendpoints', conditions, fields, options, callback);

};



AuthEndPointSchema.pre('save', function (next) {
    var userType=conf.getParam("userType");
    var appType=conf.getParam("appType");
    var msType=conf.getParam("msType");
    var tokensType= userType.concat(appType).concat(msType);



    if(!((_.intersection(tokensType,this.authToken)).length>=0))
        return next(new Error("'" +this.authToken + "' is not a valid value for `authToken`["+ tokensType+"]."));

    if(!((_.indexOf(msType,this.name.toString()))>=0))
        return next(new Error("'" +this.name + "' is not a valid value for `name`["+ msType+"]."));

    return next();
});



// AuthEndPointSchema.statics.UpdateAuthTokenSchema = function (callback){
//     var userType=conf.getParam("userType");
//     var appType=conf.getParam("appType");
//     var msType=conf.getParam("msType");
//     var tokensType= userType.concat(appType).concat(msType);
//
//
//     // console.log("!!!!!!!!!!!!!!!!!! AUYHTOKENTYPE:" + tokensType);
//     // AuthEndPointSchema.path('authToken', [{type: String, enum: tokensType, index: true, required:true}]);
//     // //AuthEndPointSchema.path('authToken', [{type: String, enum: tokensType, index: true, required:true}]);
//     // console.log("!!!!!!!!!!!!!!!!!! USERTYPE:" + msType);
//     // AuthEndPointSchema.path('name', [{type: String, enum: msType, index: true, required:true}]);
//     //
//     // AuthEndPoint = mongoose.model('authendpoints', AuthEndPointSchema);
//
//     return callback(null);
//
// };

//AuthEndPointSchema.index({ URI: 1, method: 1},{ unique: true });

var AuthEndPoint = mongoose.model('authendpoints', AuthEndPointSchema);



module.exports.AuthEndPointSchema = AuthEndPointSchema;
module.exports.AuthEndPoint = AuthEndPoint;
