var canvas1 = document.getElementById("canvas1");
var ctx = canvas1.getContext("2d");
ctx.imageSmoothingEnabled= false;

var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");
ctx2.imageSmoothingEnabled= false;


const images = [];

let imgLoadProg = 0;
let imgLoadProgMax = 0;
let waitInterval;

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
                if(!waitInterval) {
                    waitInterval = setInterval(wait, 1000/20);
                }

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
    powerupCounter : 0,
    poweredUp : false,
    powerType : "none",
    powerUpRest : false,
    fireRate : 15,
    shotTimer : 0,
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
        if(this.shotTimer < this.fireRate) {
            return;
        }
        projectileCount++;
        projectiles[projectileCount] = new Projectile(this.x, this.y, "ally", images[2])
        this.shotTimer = 0;
    }
}


let enemyCount = 0;
const enemies = [];


let enemy = {
    x : 700,
    y : 0,
    w : 88,
    h : 100,
    hp : 100,
    shootChance : 0,
    burstChance : 0,
    fallSpeed : 0.285,
    flapStrength : -6,
    verticalSpeed : 0,
    flapChance : 0,
    alive : true,
    img : images[3],
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

let enemy2 = {
    x : 700,
    y : 0,
    w : 100,
    h : 75,
    hp : 100,
    shootChance : 0,
    burstChance : 0,
    fallSpeed : 0.567,
    flapStrength : -9,
    verticalSpeed : 0,
    flapChance : 0,
    alive : true,
    draw : function () {
        ctx.drawImage(images[5], this.x, this.y)
        ctx.fillStyle = "red"
        ctx.fillRect(this.x - 5, this.y + images[5].height, 100, 10)
        ctx.fillStyle = "green"
        ctx.fillRect(this.x - 5, this.y + images[5].height, this.hp, 10)
    },
    flap : function () {
        enemy.verticalSpeed = enemy.flapStrength;
    },
    shoot : function () {
        projectileCount++;
        projectiles[projectileCount] = new Projectile(this.x, this.y, "enemy", images[6])
    }
}

let enemy3 = {
    x : 700,
    y : 0,
    w : 100,
    h : 75,
    hp : 100,
    shootChance : 0,
    burstChance : 0,
    fallSpeed : 0.765,
    flapStrength : -14,
    verticalSpeed : 0,
    flapChance : 0,
    alive : true,
    draw : function () {
        ctx.drawImage(images[7], this.x, this.y)
        ctx.fillStyle = "red"
        ctx.fillRect(this.x - 5, this.y + images[7].height, 100, 10)
        ctx.fillStyle = "green"
        ctx.fillRect(this.x - 5, this.y + images[7].height, this.hp, 10)
    },
    flap : function () {
        enemy.verticalSpeed = enemy.flapStrength;
    },
    shoot : function () {
        projectileCount++;
        projectiles[projectileCount] = new Projectile(this.x, this.y, "enemy", images[8])
    }
}

let enemy4 = {
    x : 700,
    y : 0,
    w : 100,
    h : 100,
    hp : 100,
    shootChance : 0,
    burstChance : 0,
    fallSpeed : 0.765,
    flapStrength : -16,
    verticalSpeed : 0,
    flapChance : 0,
    alive : true,
    draw : function () {
        ctx.drawImage(images[9], this.x, this.y)
        ctx.fillStyle = "red"
        ctx.fillRect(this.x - 5, this.y + images[7].height, 100, 10)
        ctx.fillStyle = "green"
        ctx.fillRect(this.x - 5, this.y + images[7].height, this.hp, 10)
    },
    flap : function () {
        enemy.verticalSpeed = enemy.flapStrength;
    },
    shoot : function () {
        projectileCount++;
        projectiles[projectileCount] = new Projectile(this.x, this.y, "enemy", images[10])
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
                enemy.x + enemy.w > this.x &&
                enemy.y < this.y + this.img.height &&
                enemy.h + enemy.y > this.y) {
                    this.hit = true;
                    enemy.hp -= 5;
                    if(!player.poweredUp) {
                        player.powerupCounter += 1;
                    }

                    //console.log(player.powerupCounter);
                }
        } else {
            if (player.x < this.x + this.img.width &&
                player.x + images[0].width > this.x &&
                player.y < this.y + this.img.height &&
                images[0].height + player.y > this.y) {
                    this.hit = true;
                    if(player.poweredUp == true && player.powerType == "shield") {
                        return;
                    }
                    if(lvl == 1) {
                        player.hp -= 5;
                    }
                    if(lvl == 2) {
                        player.hp -= 7;
                    }
                    if(lvl == 3) {
                        player.hp -= 10;
                    }
                    if(lvl == 4) {
                        player.hp -= 12;
                    }
                }
        }
    }

}


document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    readKey(code)

});




poland = new Audio("poland.mp3");
diss = new Audio("diss.mp3");
dope = new Audio("dope.mp3");

function readKey(code) {
    console.log(code)
    switch(code) {
        case "Space":
            player.shoot(); 
            break;
        case "KeyB":

            if(!player.powerUpRest) {
                player.powerType = "burst";
            } else {
                player.powerType = "none";
            }


            break;
        case "KeyS":
            if(!player.powerUpRest) {
                player.powerType = "shield";
            } else {
                player.powerType = "none";
            }

            break;

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

let lvl = 1;

let burstCounter = 0;

let tatesong = new Audio("tatesong.mp3")

let powerUpTime = 0;

let powerUpCoolDown = 0;


function update() {

    player.shotTimer++;

    powerUpCoolDown++;

    if(player.powerUpRest == true && powerUpCoolDown >= 1000) {
        player.powerUpRest = false;
    }


    if(player.powerupCounter == 0) {
        powerUpTime = 0;
    }

    if(player.powerupCounter >= 5 && player.powerUpRest == false) {
        player.poweredUp = true;
        console.log("POWER??")
    }

    if(player.poweredUp && player.powerType == "burst") {
        powerUpTime += 1;
        if(powerUpTime > 132) {
            player.poweredUp = false;
            player.powerupCounter = 0;
            player.powerType = "none";
            player.powerUpRest = true;
            player.fireRate = 15;
        } else {
            player.fireRate = 4;
        }
    }

    if(player.poweredUp && player.powerType == "shield") {
        powerUpTime += 1;
        if(powerUpTime > 210) {
            player.poweredUp = false;
            player.powerupCounter = 0;
            player.powerType = "none";
            player.powerUpRest = true;
        } else {

        }
    }






    if(lvl == 2) {
        diss.play();
        poland.volume = 0.35;
    }

    if(lvl == 3) {
        tatesong.play();
        diss.pause();
        poland.volume = 0.35;
    }
    if(lvl == 4) {
        dope.play();
        tatesong.pause();
        poland.volume = 0.35;
    }

    if(player.hp <= 0) {
        alert("THE POLISH POLICE CONFISCATED UR WOCK! BOZO! L!");
        clearInterval(gameInterval);
    }
    if(enemy.hp <= 0 && lvl == 1) {
        enemy = enemy2;
        lvl = 2;
    }
    if(enemy.hp <= 0 && lvl == 2) {
        enemy = enemy3;
        lvl = 3;
    }
    if(enemy.hp <= 0 && lvl == 3) {
        enemy = enemy4;
        lvl = 4;
    }




    if(enemy.hp <= 0 && lvl == 4) {
        alert("YOU TOOK THE WOCK TO POLAND! W! FUCK COPS! AND EMINEM!");
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

    if(enemy.y + enemy.h > 600) {
        enemy.y = 600 - enemy.h
        enemy.flap();
    }

    if(player.y < 0) {
        player.y = 0;
    }
    
    if(enemy.y < 0) {
        enemy.y = 0;
    }




    enemy.flapChance = randomNumber(0, 20);

    if(enemy.flapChance == 7 && enemy.y > 50 && lvl == 1) {
        enemy.flap();
    } 

    if(lvl == 2) {
        enemy.flapChance = randomNumber(0, 18);
    }

    if(lvl == 3) {
        enemy.flapChance = randomNumber(0, 14);
    }

    if(lvl == 4) {
        enemy.flapChance = randomNumber(0, 12);
    }
    if(enemy.flapChance == 7 && enemy.y > 50 && lvl == 2) {
        enemy.flap();
    }

    if(enemy.flapChance == 7 && enemy.y > 50 && lvl == 3) {
        enemy.flap();
    }

    if(enemy.flapChance == 7 && enemy.y > 50 && lvl == 4) {
        enemy.flap();
    }

    enemy.shootChance++;
    enemy.burstChance++;


    if(enemy.burstChance >= 50 && lvl == 2) {
        enemy.shootChance = 25;
        burstCounter++;
    }

    if(enemy.burstChance >= 50 && lvl == 3) {
        enemy.shootChance = 25;
        burstCounter++;
    }

    if(enemy.burstChance >= 50 && lvl == 4) {
        enemy.shootChance = 25;
        burstCounter++;
    }

    if(enemy.shootChance >= 25) {
        enemy.shoot();
        enemy.shootChance = 0;
    }

    if(burstCounter >= 10 && lvl == 2) {
        burstCounter = 0;
        enemy.burstChance = 0;
    }

    if(burstCounter >= 20 && lvl == 3) {
        burstCounter = 0;
        enemy.burstChance = 0;
    }

    if(burstCounter >= 30 && lvl == 4) {
        burstCounter = 0;
        enemy.burstChance = 0;
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
    
    if(player.poweredUp == true && player.powerType == "shield") {
        ctx.beginPath();
        ctx.arc(player.x + 40, player.y + 45, 55, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }


    enemy.draw();

    if(player.poweredUp && player.powerUpRest == false) {
        ctx.font = "50px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("POWER UP READY!", 220, 250);
    }


    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("B", 235, 475);
    ctx.fillText("S", 332, 475);
    ctx.drawImage(images[11], 200, 475);
    ctx.drawImage(images[12], 300, 475);

}

function gameLoop() {
    update();
    draw();
}

