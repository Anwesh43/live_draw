var mongoose = require('mongoose');
var drawSchema = mongoose.Schema({id:Number,x:Number,y:Number,deg:Number});
module.exports = drawSchema;
