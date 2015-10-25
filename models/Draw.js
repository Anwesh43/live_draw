var mongoose = require('mongoose');
var drawSchema = require('./drawSchema.js');
var Draw = mongoose.model('Draws',drawSchema);
module.exports = Draw;
