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
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;




var UserAndAppTypesSchema= new Schema({
    name: {type: String, index: true, required:true},
    type: {type: String, enum: ["user","app"], required:true},
    super:{type:Boolean, default:false}
}, {strict: "throw"});


UserAndAppTypesSchema.index({name:1,type:1},{ unique: true });


// Static method to retrieve resource WITH metadata
UserAndAppTypesSchema.statics.findAll = function (conditions, fields, options, callback) {
    return findAllFn(this, 'userandapptypes', conditions, fields, options, callback);
};

var UserAndAppTypes = mongoose.model('userandapptypes', UserAndAppTypesSchema);



module.exports.UserAndAppTypesSchema = UserAndAppTypesSchema;
module.exports.UserAndAppTypes = UserAndAppTypes;
