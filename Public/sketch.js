var socket;
var playerList = [];
var playerID = 1000;
var zoom = 1;
var quadr;
specmode = false;
var bola = new Bola();
var xadjust = 0;
var yadjust = 0;

for (var i = 0; i < 2; i++) {
  playerList[i] = new Player();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  background(55,0,30);
  quadr = new Quadra();
  xadjust = windowWidth/2 - quadr.sx/2;
  yadjust = windowHeight/2 - quadr.sy/2;


  socket.on('full', function() {
    specmode = true;
  });

  socket.on('ball', function(b) {
    bola.x = b.x;
    bola.y = b.y;
  });

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
  createCanvas(windowWidth, windowHeight);
  background(100, 200, 50);
  quadr.draw();
  bola.draw();
  for (var i = 0; i < playerList.length; i++) {
    playerList[i].draw();
  }
  if(!specmode){
    controlpadfunc();
  }else{
    textSize('30');
    fill(random(0,255), random(0,255), random(0,255));
    text('spectating', windowWidth/2, windowHeight/2);
  }
  socket.emit('request');
}


function Player(){
  this.x = -100;
  this.y = -100;

  this.draw = function() {
    fill(0,0,0,50);
    rect(this.x +xadjust,this.y-2+yadjust, -7, 14);
    fill(19, 164, 190);
    rect(this.x+xadjust, this.y+yadjust, 7, 14);
    fill(105, 46, 10);
    rect(this.x+xadjust, this.y+4+yadjust, 7, 5);

  }
}


function Quadra(){
  this.x = 0;
  this.y = 0;
  this.sx = 1400;
  this.sy = 600;

  this.draw = function(){
    strokeWeight(2);
    stroke(255);
    fill(100, 150, 50);
    rect(this.x+xadjust, this.y+yadjust, this.sx, this.sy);
    rect(this.sx/4+this.x+xadjust, this.y+yadjust, this.sx/2, this.sy);
    rect(this.sx/4+this.x+xadjust, this.y+yadjust, this.sx/2, this.sy/2);
    //draw net
    fill(0,0,0,50);
    noStroke();
    rect(this.x+this.sx/2-6+xadjust, yadjust-55, 4, 700);
    fill(255);
    rect(this.x+this.sx/2-2+xadjust, yadjust-50, 4, 700);
  }
}

function Bola(){
  this.x = 0;
  this.y = 0;

  this.draw = function() {
    fill(255, 255, 50);
    rect(this.x+xadjust, this.y+yadjust, 6, 6);
  }
}

function controlpadfunc() {
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
}
