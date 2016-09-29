var mongoose = require('mongoose');
var findAllFn = require('./metadata').findAll;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;




var MicroserviceSchema = new Schema({
    name: {type: String, index: true, required:true},
    baseUrl: String,
    token:String,
    color:String,
    icon:String
}, {strict: "throw"});



// Static method to retrieve resource WITH metadata
MicroserviceSchema.statics.findAll = function (conditions, fields, options, callback) {
    return findAllFn(this, 'microservices', conditions, fields, options, callback);
};



var Microservice = mongoose.model('microservices', MicroserviceSchema);



module.exports.MicroserviceSchema = MicroserviceSchema;
module.exports.Microservice = Microservice;
