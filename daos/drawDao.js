var Draw = require('../models/Draw.js');
var daoObject = {};
daoObject.save = function(obj,cb) {
  var drawObj = new Draw(obj);
  drawObj.save(function(err){
    if(err == null) {
      cb.call(this,'SUCCESS');
    }
  });
}
daoObject.find = function(obj,cb) {
  Draw.find(obj,function(err,data){
      if(err == null) {
        cb.call(this,data);
      }
  });
}
daoObject.update = function(obj,cb) {
    Draw.update({id:obj.id},{$set:{x:obj.x,y:obj.y,deg:obj.deg}},function(err){
      if(err == null) {
          cb.call(this,'updated successfully');
      }
    });
}
module.exports = daoObject;
