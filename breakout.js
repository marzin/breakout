window.onload = function() {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    walls = [];
    
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
        balls.forEach(function(item) {
          item.r--;
        });
        break;
      case 38: //up
        balls.push(new Ball());
        break;
      case 39: //right
        balls.forEach(function(item) {
          item.r++;
        });
        break;
      case 40: //down
        balls.pop();
        break;
    }
  }
  
  function Ball() {
    this.r = 1;
    this.speed = 4;
    this.px = canv.width / 2;
    this.py = canv.height / 2;
    var a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a) * this.speed;
    this.vy = Math.sin(a) * this.speed;
  
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
      if (this.py > canv.height - this.r) {
        this.vy = -this.vy;
        this.py = canv.height - this.r;
      }
    };
  
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.px, this.py, this.r, 0, 2 * Math.PI);
      //ctx.fill();
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
    count.innerHTML = balls.length;
  }
  