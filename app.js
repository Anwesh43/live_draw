var express = require('express');
var http = require('http');
var path = require('path');
var socketIo = require('socket.io');
var app = express();
var server = http.createServer(app);
var io = socketIo(server);
var subApp = express();
var drawDao = require('./daos/drawDao.js');
var mongoose = require('mongoose');
var seqQueue = require('seq-queue');
var queue = seqQueue.createQueue(1000);
var isConnected = false;
var serverPinData = [];
var totalDataComplete = 0;
mongoose.connect('mongodb://127.0.0.1:27017/drawXYdb');
app.get('/insertDraw/:x/:y/:id',function(req,res){
    drawDao.save(req.params,function(data){
        console.log(data);
        res.send('success');
    });
});
app.get('/updateDraw/:x/:y/:id',function(req,res){
  drawDao.update(req.params,function(data){
      console.log(data);
      res.send(data);
  })
});
app.get('/getCount/',function(req,res){
    drawDao.find({},function(data){
      console.log(data);
      res.send(""+data.length);
    })
});
io.on('connection',function(socket){
    queue.push(function(task){
      drawDao.find({},function(data){
          console.log(data);
          socket.emit('countOfElements',{count:data.length,pins:data});
          task.done();
      });
    });
    socket.on('createData',function(data){
        queue.push(function(task){
          if(serverPinData.length == 0) {

            task.done();
          }
          serverPinData.forEach(function(pin,index){
            drawDao.update(pin,function(data){
              totalDataComplete++;
              if(totalDataComplete == serverPinData.length) {
                console.log('updating the recent values');
                task.done();
              }
            });
          });
        });
        queue.push(function(task){
          drawDao.save(data,function(status){
              console.log(status);
              task.done();
              serverPinData.push(data);
              io.emit('newPin',{pin:data});
          });
        });
    });
    socket.on('updateData',function(data){
      queue.push(function(task){
        drawDao.update(data,function(status){
          console.log(status);
          task.done();
          serverPinData.forEach(function(pin,index){
                if(pin.id == data.id) {
                  serverPinData[index] = data;
                  return;
                }
          });
          io.emit('updatedPin',{pin:data});
        });
      });
    });
});
setInterval(function(){
  serverPinData.forEach(function(pin,value){
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
    return pin;
  });
},100);
subApp.use(express.static(path.join(__dirname,'public')));
subApp.listen(8001);
server.listen(8000);
