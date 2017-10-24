window.onload = function() {
    canv = document.getElementById("gc");
    canv.width = 300;
    canv.height = 500;
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    walls = [];
    
    player = new Player();

    bricks = [];
    var n = 5;
    while (n--) {
      bricks.push(new Brick(n%10*20+50 , Math.floor(n/10)*10 + 100, 1));
    }

    balls = [];
    var i = 1;
    while (i--) {
      balls.push(new Ball());
    }
    count = document.getElementById("count");
    setInterval(tick, 1000 / 60);
  };
  
  function keyPush(evt) {
    switch (evt.keyCode) {
      case 37: //left
       /*  balls.forEach(function(brick) {
          if(brick.r>1){brick.r--;}
        }); */
        if(player.px>player.width/2){player.px = player.px - player.speed;}
        break;
      case 38: //up
        balls.push(new Ball());
        break;
      case 39: //right
       /*  balls.forEach(function(brick) {
          if(brick.r<40){brick.r++;}
        }); */
        if(player.px<canv.width-player.width/2){player.px = player.px + player.speed;}
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
      ctx.beginPath();
      ctx.rect(this.px ,this.py , this.width, this.height);
      ctx.stroke();
    };

    
  }

  function Ball() {
    this.r = 3;
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
          console.log('boom');
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
  }
  
