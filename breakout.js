window.onload = function() {
    canv = document.getElementById("gc");
    canv.width = 300;
    canv.height = 500;
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    walls = [];
    
    player = new Player();
    bricks = [];
    var n = 50;
    while (n--) {
      bricks.push(new Brick(n%10*20+50 , Math.floor(n/10)*10 + 100, 3));
    }

    balls = [];
    var i = 1;
    while (i--) {
      balls.push(new Ball());
    }
    count = document.getElementById("count");
    /* setInterval(tick, 1000 / 60); */
    tick();
  };
  
  function keyUp(evt) {
    switch (evt.keyCode) {
      case 37: //left
      case 39: //right
        player.move = 0;
        break;
    }
  }

  function keyDown(evt) {
    
    switch (evt.keyCode) {
      case 37: //left
       /*  balls.forEach(function(brick) {
          if(brick.r>1){brick.r--;}
        }); */
        /* if(player.px>player.width/2){player.px = player.px - player.speed;} */
        player.move = -1;
        break;
      case 38: //up
        balls.push(new Ball());
        break;
      case 39: //right
       /*  balls.forEach(function(brick) {
          if(brick.r<40){brick.r++;}
        }); */
        /* if(player.px<canv.width-player.width/2){player.px = player.px + player.speed;} */
        player.move = 1;
        break;
      case 40: //down
        balls.pop();
        break;
    }
  }
  
  function Brick( x, y, life){
    this.px = x;
    this.py = y;
    this.width = 20;
    this.height = 10;
    this.life = life;

    this.draw = function() {
      switch(this.life){
        case 2:  
          ctx.fillStyle = "orange";
          break;
          case 1:  
          ctx.fillStyle = "red";
          break;
          default :
          ctx.fillStyle = "black";
          break;
       }
      ctx.fillRect(this.px ,this.py , this.width, this.height);
    };
    
    
  }

  function Ball() {
    this.r = 3;
    this.speed = 300;
    this.px = canv.width / 2;
    this.py = canv.height / 2;
    var a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a) * this.speed;
    this.vy = Math.sin(a) * this.speed;
    this.alive = true;
  
    this.update = function(dt) {
      this.px += this.vx * dt;
      this.py += this.vy * dt;
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
        //this.vy = -this.vy;
        var r = (player.px + player.width/2 - this.px) / player.width;
        var a =  r * Math.PI * 0.5 + Math.PI/4;
        this.vx = Math.cos(a) * this.speed;
        this.vy = -Math.sin(a) * this.speed;
        this.py = player.py - this.r;
      }
      if (this.py > canv.height - this.r) {
        /* this.vy = -this.vy;
        this.py = canv.height - this.r; */
        this.alive = false;
      }
    };
  
    this.intersect = function(brick){
        if(this.px > brick.px && this.px < brick.px + brick.width && this.py > brick.py && this.py < brick.py + brick.height){
          if( (this.px-this.vx < brick.px || this.px-this.vx > brick.px+brick.width) && this.py-this.vy > brick.py && this.py-this.vy < brick.py + brick.height){
            this.vx=-this.vx;
          }
          else if((this.py-this.vy < brick.py || this.py-this.vy > brick.py + brick.height) && this.px-this.vx > brick.px && this.px-this.vx < brick.px + brick.width){
            this.vy=-this.vy;
          }
          brick.life--;
        }
    };

    this.draw = function() {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(this.px, this.py, this.r, 0, 2 * Math.PI);
      ctx.fill();
      //ctx.stroke();
    };
  }
  
  function Player(){
    this.px = canv.width / 2;
    this.py = canv.height - 30;
    this.width = 140;
    this.thickness = 5;
    this.speed = 10;
    this.move = 0;

    this.draw = function(){
      if(this.px + this.move * this.speed <=canv.width-this.width/2 && this.px + this.move * this.speed>=this.width/2){
        this.px = this.px + this.move * this.speed;
      }
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.rect(this.px - this.width/2, this.py, this.width, this.thickness);
      ctx.stroke();
    };
  }

  var dt = 0;
  var lastTime = 0;
  function tick(time) {
    dt = (time - lastTime) / 1000;
    ctx.clearRect(0, 0, canv.width, canv.height);
    
    balls.forEach(function(item) {
      item.update(dt);
      bricks.forEach(function(brick){
        item.intersect(brick);
      });
      item.draw();
    });
    
    var i = bricks.length;
    while(i--){
      if(bricks[i].life < 1 ){
        bricks.splice(i,1);
      }
    }

    bricks.forEach(function(brick){
      brick.draw();
    });

    i = balls.length;
    while(i--){
      if(balls[i].alive === false ){
        balls.splice(i,1);

      }
    }
    player.draw();

    count.innerHTML = balls.length;
    lastTime = time;
    requestAnimationFrame(tick);
  }
