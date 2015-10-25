var pin = {};
var pins = [];
var pinController = {};
var socket = io.connect('http://192.168.1.3:8000');
socket.on('newPin',function(obj){
  if(pin.id != obj.pin.id) {
      pins.push(obj.pin);
  }

  console.log('reaching here');
});
socket.on('updatedPin',function(obj){
  pins.forEach(function(pinObj,index){
    if(pinObj.id == obj.pin.id) {
      pins[index] = obj.pin;
      console.log(index);
      console.log(obj.pin);
      return;
    }
  });
  console.log('changed here');
});
socket.on('countOfElements',function(obj){
  console.log(obj);
  pin.id = obj.count+1;
  pinController.randomizePinPosition(pin);
  socket.emit('createData',pin);
  alert(obj.count);
  pins = obj.pins;
});
pin.x = 0;
pin.y = 0;
pin.deg = 0;
pinController.drawPin = function(ctx,pin) {
  ctx.save();
  ctx.translate(pin.x,pin.y);
  ctx.rotate(pin.deg*Math.PI/180);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(50,0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(60,0,10,0,2*Math.PI);
  ctx.fill();
  ctx.restore();
}
pinController.randomizePinPosition = function(pin) {
  pin.x = Math.floor(Math.random()*1000);
  pin.y = Math.floor(Math.random()*600);
}
pinController.movePin = function(pin) {
  if(pin.deg == 0) {
    pin.x+=10;
  }
  else if(pin.deg == 180) {
    pin.x -= 10;
  }
  else if(pin.deg == 90) {
    pin.y +=10;
  }
  else if(pin.deg == 270) {
    pin.y -= 10;
  }
  pin.x %= 1000;
  pin.y %= 600;
  if(pin.x<0) {
    pin.x = 1000;
  }
  if(pin.y<0) {
    pin.y = 600;
  }
}
window.onload = function(){
  var canv1 = document.getElementById('canv1');
  var ctx = canv1.getContext('2d');
  var drawWorker = new Worker('drawWorker.js');
  var x = 0,y = 0;
  drawWorker.onmessage = function() {
    ctx.clearRect(0,0,1000,600);
    pinController.drawPin(ctx,pin);
    pinController.movePin(pin);
    pins.forEach(function(pinObj,index){
      pinController.drawPin(ctx,pinObj);
      pinController.movePin(pinObj);
    });
  }
};
