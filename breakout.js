window.onload = function() {
    canv = document.getElementById("gc");
    canv.width = 300;
    canv.height = 500;
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    walls = [];
    
    player = new Player();
    balls = [];
    var i = 2;
    while (i--) {
      balls.push(new Ball());
    }
    count = document.getElementById("count");
    setInterval(tick, 1000 / 60);
  };
  
  function keyPush(evt) {
    switch (evt.keyCode) {
      case 37: //left
       /*  balls.forEach(function(item) {
          if(item.r>1){item.r--;}
        }); */
        if(player.px>player.width/2){player.px = player.px - player.speed;}
        break;
      case 38: //up
        balls.push(new Ball());
        break;
      case 39: //right
       /*  balls.forEach(function(item) {
          if(item.r<40){item.r++;}
        }); */
        if(player.px<canv.width-player.width/2){player.px = player.px + player.speed;}
        break;
      case 40: //down
        balls.pop();
        break;
    }
  }
  
  function Ball() {
    this.r = 4;
    this.speed = 4;
    this.px = canv.width / 2;
    this.py = canv.height / 2;
    var a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a) * this.speed;
    this.vy = Math.sin(a) * this.speed;
    this.alive = true;
  
    this.update = function() {
      this.px += this.vx;
      this.py += this.vy;
      if (this.px < this.r) {
        this.vx = -this.vx;
        this.px = this.r;
      }
      if (this.px > canv.width - this.r) {
        this.vx = -this.vx;
        this.px = canv.width - this.r;
      }
      if (this.py < this.r) {
        this.vy = -this.vy;
        this.py = this.r;
      }
      if (this.py > player.py - this.r && this.px > player.px - player.width/2 && this.px < player.px + player.width/2 && this.py < player.py + player.thickness + this.r) {
        this.vy = -this.vy;
        this.py = player.py - this.r;
      }

      if (this.py > canv.height - this.r) {
        /* this.vy = -this.vy;
        this.py = canv.height - this.r; */
        this.alive = false;
        console.log("to delete");
      }
    };
  
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.px, this.py, this.r, 0, 2 * Math.PI);
      //ctx.fill();
      ctx.stroke();
    };
  }
  
  function Player(){
    this.px = canv.width / 2;
    this.py = canv.height - 30;
    this.width = 150;
    this.thickness = 5;
    this.speed = 10;

    this.draw = function(){
      ctx.beginPath();
      ctx.rect(this.px - this.width/2, this.py, this.width, this.thickness);
      ctx.stroke();
    };
  }

  function tick() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "black";
    balls.forEach(function(item) {
      item.update();
      item.draw();
    });
    var i = balls.length;
    while(i--){
      if(balls[i].alive === false ){
        balls.splice(i,1);
        console.log("dead!");
      }
      
    }
    player.draw();

    count.innerHTML = balls.length;
  }
  
