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
var onlinePlayers = 0;
var ball;
var lastouch = 100; //guarda o id do ultimo player a tocar na bola

function newConnection(socket){
	if(onlinePlayers <= 1){
		console.log('New Player Online, socket connection: ' + socket.id);
		ball = new Ball();
		playerArray[onlinePlayers] = new Player();
		socket.emit('new-player', onlinePlayers);
		onlinePlayers++;
	}else {
		console.log("Rom is full");
		socket.emit('full');
	}
  socket.on('joystick-mv-vert', movev);
  socket.on('joystick-mv-horz', moveh);
	socket.on('request', function() {
		ballmove();
		socket.emit('ball', ball);
		socket.emit('update', playerArray, onlinePlayers);
	});
}

function ballmove(){
	for (var i = 0; i < onlinePlayers; i++) {
		if(lastouch != i){
			if(playerArray[i].x<ball.x && playerArray[i].y<ball.y){
				if(playerArray[i].x+playerArray[i].width>ball.x){
					if(playerArray[i].y+playerArray[i].height>ball.y){
						ball.speedX = -1*ball.speedX*(Math.random());
						ball.speedY = Math.random()-Math.random();
						lastouch = i;
					}
				}
			}
		}
	}
	ball.x = ball.x+ball.speedX;
	ball.y = ball.y+ball.speedY;
}

function Player(){
  this.x = 500*(onlinePlayers+1);
  this.y = 500;
	this.width = 100;
	this.height = 100;
}

function Ball(){
	this.x = 200;
	this.y = 555;
	this.speedX = 3;
	this.speedY = 0;
}

function moveh(player, vx) {
	playerArray[player].x += 5*vx;
}
function movev(player, vy) {
	playerArray[player].y += 5*vy;
}

function test() {
  console.log(playerArray[onlinePlayers].x);
}
/////////JOYSTICK/////////
