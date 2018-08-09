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
var Schema = mongoose.Schema;
var commonfunctions=require('../routes/commonfunctions');



var conf=require('../routes/configSettingManagment');
var passportLocalMongoose = require('passport-local-mongoose');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema = new Schema({
    //id: {type: Schema.Types.ObjectId},
    email: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        required: 'Email address is required',
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    type: {type: String, index: true, required:true}, //client | admin
    //validated : {type:Boolean, default: true, required:true},
    enabled : {type:Boolean, default: true, required:true}
    // password: String,  // passportLocalMongoose manage hash and salt information
}, {strict: "throw"});


// Static method to retrieve resource WITH metadata
UserSchema.statics.findAll = function (conditions, fields, options, callback) {
    return findAllFn(this, 'users', conditions, fields, options, callback);
};

UserSchema.pre('save', function (next) {

    var _this=this;
    commonfunctions.getUsers(function(err,usrJson){
        var userType=usrJson.userType;
        if(!((_.indexOf(userType,_this.type.toString()))>=0))
            return next(new Error("'" +_this.type + "' is not a valid value for user field `type`["+ userType+"]."));

        return next();
    });



});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});


var User = mongoose.model('users', UserSchema);

module.exports.UserSchema = UserSchema;
module.exports.User = User;
