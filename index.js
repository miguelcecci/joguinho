////////////////////////////////////
console.log("Starting Server ...");
var express = require('express');
var port = 3000;

var app = express();
var server = app.listen(port);

app.use(express.static('Public'));
console.log("server is running on port: " + port);
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);
///////////////////////////////////
var playerArray = [];
for (var i = 0; i < 2; i++) {
	playerArray[i] = 0;
}
var onlinePlayers = 0;
var ball;
var lastouch = 100; //guarda o id do ultimo player a tocar na bola

function newConnection(socket){
	if(onlinePlayers <= 1){
		console.log('New Player Online, socket connection: ' + socket.id);
		ball = new Ball();
		for(i=0; i<=playerArray.length; i++){
			if(playerArray[i] == 0){
				playerArray[i] = new Player(socket.id, i);
				socket.emit('new-player', i);
				break;
			}
		}
		onlinePlayers++;
	}else {
		console.log("Rom is full");
		socket.emit('full');
	}
  socket.on('joystick-mv-vert', movev);
  socket.on('joystick-mv-horz', moveh);
	socket.on('disconnect', function(){
		console.log('desconectado', socket.id);
		for (var i = 0; i < playerArray.length; i++) {
			if(playerArray[i] != 0){
				if(playerArray[i].id == socket.id){
					playerArray[i] = 0;
				}
			}
		}
		onlinePlayers--;
	});
	socket.on('request', function(id) {
		if(id != 1000){
			ballmove();
		}
		socket.emit('ball', ball);
		socket.emit('update', playerArray, playerArray.length);
	});
}

function ballmove(){
	for (var i = 0; i < playerArray.length; i++) {
		if(playerArray[i] != 0){
			if(lastouch != i){
				if(playerArray[i].x<ball.x && playerArray[i].y<ball.y){
					if(playerArray[i].x+playerArray[i].width>ball.x){
						if(playerArray[i].y+playerArray[i].height>ball.y){
							ball.speedX = -1*(ball.speedX+ball.speed*0.2);
							ball.speedY = (ball.y-playerArray[i].y-15)/20;
							lastouch = i;
						}
					}
				}
			}
		}
	}
	if(ball.x>1300){
		ball.x = 650;
		ball.y = 500;
	}
	if(ball.x<0 ){
		ball.x = 650;
		ball.y = 500;
	}
	ball.x = ball.x+ball.speedX;
	ball.y = ball.y+ball.speedY;
}

function Player(id, playerNumber){
	this.id = id;
  this.x = 400+700*playerNumber;
  this.y = 300;
	this.width = 30;
	this.height = 30;
}

function Ball(){
	this.x = 200;
	this.y = 555;
	this.speedX = 2;
	this.speedY = 0;
}

function moveh(player, vx) {
	playerArray[player].x += 5*vx;
}
function movev(player, vy) {
	playerArray[player].y += 5*vy;
}

/////////JOYSTICK/////////
