class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    constructor(w, h) {
        this.color = "#000";
        this.pos = new Vec();
        this.size = new Vec(w, h);
    }
    collides(shape) {
        return shape.bottom > this.top &&
            shape.right > this.left &&
            shape.left < this.right &&
            shape.top < this.bottom;
    }
    get top() { return this.pos.y; }
    get bottom() { return this.pos.y + this.size.y; }
    get left() { return this.pos.x; }
    get right() { return this.pos.x + this.size.x; }
}

class Ball extends Shape {
    constructor(diameter = 4) {
        super(diameter, diameter);
        this.state = 0;
        this.vel = new Vec();
        this.lastPos = new Vec();
    }
    // constructor(x, y, a) {
    //     this.r = 3;
    //     this.speed = 300;
    //     this.x = x;
    //     this.y = y;
    //     this.vx = Math.cos(a) * this.speed;
    //     this.vy = Math.sin(a) * this.speed;
    //     this.alive = true;
    // }
    draw(ctx) {
        ctx.fillStyle = '#0f0';
        ctx.beginPath();
        ctx.arc(this.pos.x + this.size.x / 2,
            this.pos.y + this.size.y / 2,
            this.size.x / 2,
            0, Math.PI * 2, false);
        ctx.fill();
    }

    update(dt) {
        this.lastPos.x = this.pos.x;
        this.lastPos.y = this.pos.y;
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    }
}

class Player extends Shape {
    constructor() {
        super(60, 12);
        this._lastPos = new Vec(null, null);
        this.vel = new Vec();
        this.SPEED = 500;
    }
    get center() {
        return this.pos.x + this.size.x / 2;
    }

    collides(ball) {
        if (super.collides(ball)) {
            ball.vel.x = (ball.pos.x - this.center) * 3;
            ball.vel.y = -ball.vel.y;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#555';
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    update(dt, dirx) {
        this.pos.x = this.pos.x + dirx * this.SPEED * dt;
        this._lastPos.x = this.pos.x;
    }

    move(x) {
        this.pos.x = x - this.size.x / 2;
    }

    fire(ball) {
        if(!ball) {
            ball = new Ball();
            ball.pos.x = this.center - ball.size.x / 2;
            ball.pos.y = this.pos.y - ball.size.y;
            ball.vel.y = -200;
            ball.vel.x = 100;
            return ball;
        }
    }
}

class Block extends Shape {
    constructor() {
        super(20, 10);
        this.health = 1;
        this.COLORS = [
            null,
            '#0DFF72',
            '#0DC2FF',
            '#FF0D72',
            '#F538FF',
            '#FF8E0D',
            '#FFE138',
            '#3877FF',
        ];
    }

    collides(ball) {
        if (super.collides(ball)) {
            --this.health;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.COLORS[this.health];
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}

class Level extends Shape {
    constructor() {
        super(256, 240);
        this.blocks = [];
    }

    addBlock(block) {
        this.blocks.push(block);
    }

    draw(ctx) {
        ctx.fillStyle = '#2020CC';
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    update(dt) {
        this.blocks = this.blocks.filter(block => block.health > 0);
    }

    collides(ball) {
        if (ball.left < 0 || ball.right > this.size.x) {
            ball.vel.x = -ball.vel.x;
        }
        if (ball.top < 0 || ball.top > this.size.y) {
            ball.vel.y = -ball.vel.y;
        }
    }

    loadLevel(url) {
        return fetch(url)
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\r\n');
                const dimensions = rows.shift().split('x').map(parseFloat);

                const blockSize = {
                    x: (this.size.x - 1) / dimensions[0],
                    y: this.size.y / dimensions[1],
                };

                rows.forEach((row, y) => {
                    row.split('').forEach((type, x) => {
                        if (type === ' ') {
                            return;
                        }
                        const block = new Block();
                        block.pos.x = blockSize.x * x + 1;
                        block.pos.y = blockSize.y * y + 1;
                        block.size.x = blockSize.x - 1;
                        block.size.y = blockSize.y - 1;
                        block.health = type | 0;

                        this.addBlock(block);
                    });
                });
            });
    }
}

//
// Keyboard handler
//
var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.UP = 38;
Keyboard.RIGHT = 39;
Keyboard.DOWN = 40;
Keyboard.SPACE = 32;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
};

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

//
// Game object
//

var Game = {};

Game.run = function (context) {
    this.ctx = context;
    this._previousElapsed = 0;

    //  var p = this.load();
    //  Promise.all(p).then(function (loaded) {
    this.init();
    window.requestAnimationFrame(this.tick);
    // }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();
}.bind(Game);


Game.init = function () {
    Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.SPACE]);

    this.ball = null;
    this.player = new Player();
    this.level = new Level();
    this.level.loadLevel('levels/level1.txt');
    this.player.move(this.level.size.x / 2);
    this.player.pos.y = this.level.size.y - 30;
};

Game.update = function (dt) {
    // handle player movement with arrow keys
    var dirx = 0;
    if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
    if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
    if (Keyboard.isDown(Keyboard.SPACE)) {
        this.ball = this.player.fire(this.ball);
    }

    this.player.update(dt, dirx);
    if(this.ball){
        this.ball.update(dt);
        this.level.collides(this.ball);
        this.level.blocks.forEach(block => block.collides(this.ball));
        this.player.collides(this.ball);
    }
    this.level.update();
};

Game.render = function () {
    this.level.draw(this.ctx);
    this.level.blocks.forEach(block => block.draw(this.ctx));
    this.player.draw(this.ctx);
    if (this.ball) {
        this.ball.draw(this.ctx);
    }
};

//
// start up function
//
window.onload = function () {
    var context = document.getElementById('gc').getContext('2d');
    context.scale(2, 2);
    Game.run(context);
};