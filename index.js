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

function newConnection(socket){
	console.log('New Player Online, socket connection: ' + socket.id);
  playerArray[onlinePlayers] = new Player();
	socket.emit('new-player', onlinePlayers);
	onlinePlayers++;
  // socket.emit('mouse', datarray);
  socket.on('joystick-mv-vert', movev);
  socket.on('joystick-mv-horz', moveh);
	socket.on('request', function() {
		socket.emit('update', playerArray, onlinePlayers);
	});
}

function Player(){
  this.x = 500;
  this.y = 500;
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
