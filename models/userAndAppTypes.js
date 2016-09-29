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
