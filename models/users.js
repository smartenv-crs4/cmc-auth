var mongoose = require('mongoose');
var findAllFn = require('./metadata').findAll;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;



var conf=require('../routes/configSettingManagment');
var userType=conf.getParam("userType");

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
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    type: {type: String, enum: userType, index: true, required:true}, //client | admin
    //validated : {type:Boolean, default: true, required:true},
    enabled : {type:Boolean, default: true, required:true}
    // password: String,  // passportLocalMongoose manage hash and salt information
}, {strict: "throw"});


// Static method to retrieve resource WITH metadata
UserSchema.statics.findAll = function (conditions, fields, options, callback) {
    return findAllFn(this, 'users', conditions, fields, options, callback);
};



UserSchema.statics.UpdateUserTypeSchema = function (callback){
    var newUserType=conf.getParam("userType");
    UserSchema.path('type', {type: String, enum: newUserType, index: true, required:true}); //client | admin);
    return callback(null);
};

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});


var User = mongoose.model('users', UserSchema);

module.exports.UserSchema = UserSchema;
module.exports.User = User;
