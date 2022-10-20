var canvas1 = document.getElementById("canvas1");
var ctx = canvas1.getContext("2d");
ctx.imageSmoothingEnabled= false;

var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");
ctx2.imageSmoothingEnabled= false;


const images = [];

let imgLoadProg = 0;
let imgLoadProgMax = 0;

fetch("images.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        for(const pic of data) {
            images[pic.id] = new Image();
            images[pic.id].id = pic.id;
            images[pic.id].name = pic.name;
            images[pic.id].onload = function() {
                imgLoadProg++;
            }
            images[pic.id].src = pic.url;
            imgLoadProgMax++;
        }
    })


function wait() {
    if(imgLoadProg == imgLoadProgMax) {
        clearInterval(waitInterval);
        init();
    }
}

let waitInterval = setInterval(wait, 1000/20);

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const player = {
    x : 7,
    y : 0,
    hp : 100,
    fallSpeed : 0.285,
    flapStrength : -6,
    verticalSpeed : 0,
    draw : function () {
        ctx.drawImage(images[0], this.x, this.y)
        ctx.fillStyle = "red"
        ctx.fillRect(this.x - 5, this.y + images[0].height, 100, 10)
        ctx.fillStyle = "green"
        ctx.fillRect(this.x - 5, this.y + images[0].height, this.hp, 10)
    },
    flap : function () {
        player.verticalSpeed = player.flapStrength;
    },
    shoot : function () {
        projectileCount++;
        projectiles[projectileCount] = new Projectile(this.x, this.y, "ally", images[2])
    }
}


let enemyCount = 0;
const enemies = [];


const enemy = {
    x : 700,
    y : 0,
    hp : 100,
    shootChance : 0,
    fallSpeed : 0.285,
    flapStrength : -6,
    verticalSpeed : 0,
    flapChance : 0,
    alive : true,
    draw : function () {
        ctx.drawImage(images[3], this.x, this.y)
        ctx.fillStyle = "red"
        ctx.fillRect(this.x - 5, this.y + images[3].height, 100, 10)
        ctx.fillStyle = "green"
        ctx.fillRect(this.x - 5, this.y + images[3].height, this.hp, 10)
    },
    flap : function () {
        enemy.verticalSpeed = enemy.flapStrength;
    },
    shoot : function () {
        projectileCount++;
        projectiles[projectileCount] = new Projectile(this.x, this.y, "enemy", images[4])
    }
}




let projectileCount = 0;
const projectiles = [];

class Projectile {
    x;
    y;
    team;
    img;
    hit = false;

    constructor(x, y, team, img) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.img = img;
    }

    draw = function () {
        ctx.drawImage(this.img, this.x, this.y)
    }

    shoot = function () {
        if(this.team == "ally") {
            this.x += 6;
        } else {
            this.x -= 6;
        }

    }

    checkCollision = function () {
        if(this.team == "ally") {
            if (enemy.x < this.x + this.img.width &&
                enemy.x + images[3].width > this.x &&
                enemy.y < this.y + this.img.height &&
                images[3].height + enemy.y > this.y) {
                    this.hit = true;
                    enemy.hp -= 5;
                }
        } else {
            if (player.x < this.x + this.img.width &&
                player.x + images[0].width > this.x &&
                player.y < this.y + this.img.height &&
                images[0].height + player.y > this.y) {
                    this.hit = true;
                    player.hp -= 5;
                }
        }
    }

}


let inputTimer = 0;

document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    if(inputTimer >= 15) {
        inputTimer = 0;
        readKey(code)
    }

});




poland = new Audio("poland.mp3")


function readKey(code) {
    switch(code) {
        case "Space":
            player.shoot(); 
    }
}

function clicked() {
    poland.play();
    player.flap();
}

function init() {

    ctx2.drawImage(images[1], 0, 0);
    let gameInterval = setInterval(gameLoop, 1000/60);
}

function update() {

    inputTimer++;

    if(player.hp <= 0) {
        alert("THE POLISH POLICE CONFISCATED UR WOCK! BOZO! L!");
        clearInterval(gameInterval);
    }
    if(enemy.hp <= 0) {
        alert("YOU BROUGHT THE WOCK TO POLAND! W! FUCK COPS!");
        clearInterval(gameInterval);
    }


    player.y = player.y + player.verticalSpeed;
    player.verticalSpeed = player.verticalSpeed + player.fallSpeed;


    if(player.y + images[0].height > 600) {
        player.y = 600 - images[0].height
    }

    if(player.y < 0) {
        player.y = 0;
    }

    enemy.y = enemy.y + enemy.verticalSpeed;
    enemy.verticalSpeed = enemy.verticalSpeed + enemy.fallSpeed;

    if(enemy.y + images[3].height > 600) {
        enemy.y = 600 - images[3].height
        enemy.flap();
    }

    if(player.y < 0) {
        player.y = 0;
    }
    
    if(enemy.y < 0) {
        enemy.y = 0;
    }


    enemy.flapChance = randomNumber(0, 20);

    if(enemy.flapChance == 7 && enemy.y > 50) {
        enemy.flap();
    }

    enemy.shootChance++;

    if(enemy.shootChance >= 25) {
        enemy.shoot();
        enemy.shootChance = 0;
    }

    projectiles.forEach(projectile => {
        projectile.shoot();
    })
}

function draw() {
    ctx.clearRect(0, 0, canvas1.clientWidth, canvas1.clientHeight)
    projectiles.forEach(projectile => {
        projectile.draw();
        if(projectile.hit == false) {
            projectile.checkCollision();
        }

    })
    player.draw();
    enemy.draw();
}

function gameLoop() {
    update();
    draw();
}

