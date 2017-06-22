var socket;
var playerList = [];
var playerID = 1000;

for (var i = 0; i < 8; i++) {
  playerList[i] = new Player();
}

function setup() {
  xw=windowWidth;
  yw=windowHeight;
  createCanvas(xw, yw);
  socket = io.connect();
  background(55,0,30);


  socket.on('new-player',function(ID) {
    if(playerID == 1000){
      playerID = ID;
    }
    playerList[ID] = new Player();
  });
  socket.on('update', function(trespa, onlinePlayers) {
    if (playerList.length != 0) {
      for (var i = 0; i < onlinePlayers; i++) {
        playerList[i].x = trespa[i].x;
        playerList[i].y = trespa[i].y;
      }
    }
  });
}

function draw() {
  background(0);
  for (var i = 0; i < playerList.length; i++) {
    playerList[i].draw();
  }
  if (keyIsDown(LEFT_ARROW)){
    socket.emit('joystick-mv-horz', playerID, -1);
  }

   if (keyIsDown(RIGHT_ARROW)){
     socket.emit('joystick-mv-horz', playerID, 1);
   }

   if (keyIsDown(UP_ARROW)){
     socket.emit('joystick-mv-vert', playerID, -1);
   }

   if (keyIsDown(DOWN_ARROW)){
     socket.emit('joystick-mv-vert', playerID, 1);
   }
   socket.emit('request');
}
function Player(){
  this.x = 0;
  this.y = 0;

  this.draw = function() {
    fill(255);
    rect(this.x, this.y, 10, 10);
  }
}
