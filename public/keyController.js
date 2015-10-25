window.onkeydown = function(event) {
  var isChanged = false;
  if(event.keyCode==37) {
    pin.deg = 180;
    isChanged = true;
  }
  else if(event.keyCode==39) {
    pin.deg = 0;
    isChanged = true;
  }
  else if(event.keyCode == 38) {
    pin.deg = 270;
    isChanged = true;
  }
  else if(event.keyCode == 40){
    pin.deg = 90;
    isChanged = true;
  }
  if(isChanged) {
    isChanged = false;
    console.log('data to change');
    console.log(pin);
    socket.emit('updateData',pin);
  }
}
