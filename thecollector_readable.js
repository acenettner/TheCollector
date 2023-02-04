/*
    This is the slightly more readable version of my game script.
*/

var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var lastTime = 0;
const GAME_WIDTH = 256;
const GAME_HEIGHT = 256;
const PLAYER_WIDTH = 16;
const PLAYER_HEIGHT = 32;
const PLAYER_SPEED = 4;
const PICKUP_WIDTH = 16;
const PICKUP_HEIGHT = 16;
const PICKUP_SPEED = 2;
const OBSTACLE_WIDTH = 32;
const OBSTACLE_HEIGHT = 16;
const OBSTACLE_SPEED = 2;
var playerSpeed = 0;
var jumpForce = 8;
var jumpTime = 0;
var displacement = 0.5 * jumpTime * jumpTime;
var jumping = false;
var falling = false;
var movR = 0;
var movL = 0;
var score = 0;
var gameOver = false;
var displayScore = false;
var player = {
    x: (GAME_WIDTH / 2) - (PLAYER_WIDTH / 2),
    y: GAME_HEIGHT - PLAYER_HEIGHT,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT
}
var pickup = {
    x: Math.floor(Math.random() * 16) * 16,
    y: 0,
    w: PICKUP_WIDTH,
    h: PICKUP_HEIGHT
}
var obstacle = {
    x: -OBSTACLE_WIDTH,
    y: Math.floor(Math.random() * 16) * 16,
    w: OBSTACLE_WIDTH,
    h: OBSTACLE_HEIGHT
}

var obstacle2 = {
    x: GAME_WIDTH,
    y: Math.floor(Math.random() * 16) * 16,
    w: OBSTACLE_WIDTH,
    h: OBSTACLE_HEIGHT
}

// updates all game objects on screen
function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'azure';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'tan';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(pickup.x, pickup.y, pickup.w, pickup.h);
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
    ctx.fillRect(obstacle2.x, obstacle2.y, obstacle2.w, obstacle2.h);
}

function input() {
    // Move player, jump
    document.addEventListener("keydown", (event)=> {
        playerSpeed = 0;
        if (event.key == 'ArrowRight') {
            movR = PLAYER_SPEED;
        }
        if (event.key == 'ArrowLeft') {
            movL = -PLAYER_SPEED;
        }
        if (!jumping && !falling && event.key == ' ') {
            jumping = true;
        }
    })

    // Stops player when key is no longer pressed
    document.addEventListener("keyup", (event)=> {
        if (event.key == 'ArrowRight') {
            movR = 0;
        }
        if (event.key == 'ArrowLeft') {
            movL = 0;
        }
        if (gameOver && event.key == ' ') {
            reset();
        }
    })
}

// Resets game values
function reset() {
    gameOver = false;
    displayScore = false;
    score = 0;
    player.x = GAME_WIDTH/2;
    player.y = GAME_HEIGHT - PLAYER_HEIGHT;
    jumping = false;
    falling = false;
    jumpTime = 0;
    movR = 0;
    movL = 0;
    obstacle.x = -OBSTACLE_WIDTH;
    obstacle.y = Math.floor(Math.random() * 16) * 16;
    obstacle2.x = GAME_WIDTH;
    obstacle2.y = Math.floor(Math.random() * 16) * 16;
    pickup.x = Math.floor(Math.random() * 16) * 16;
    pickup.y = -PICKUP_HEIGHT;
}

// Handles player's jumping and falling
function Jump(time) {
    time /= 100;
    jumpTime += time;
    displacement = 0.5 * jumpTime * jumpTime;
    player.y += (-jumpForce + displacement);
    if (jumpForce < displacement) {
        falling = true;
        jumping = false;
    }
    if (player.y >= GAME_HEIGHT - PLAYER_HEIGHT) {
        jumpTime = 0;
        falling = false;
        player.y = GAME_HEIGHT - PLAYER_HEIGHT;
    }
}

// Handles player movement
function playerMovement(deltaTime) {
    if (movR > 0 && player.x >= GAME_WIDTH - PLAYER_WIDTH) {
        movR = 0;
    }
    if (movL < 0 && player.x <= 0) {
        movL = 0;
    }
    player.x += movR + movL;
    
    if (jumping || falling) {
        Jump(deltaTime);
    }
}

// Handles movement of all pickups
function pickupMovement() {
    pickup.y += PICKUP_SPEED
    if (pickup.y >= GAME_HEIGHT) {
        pickup.y = -PICKUP_HEIGHT;
        pickup.x = (Math.floor(Math.random() * 16) * 16);
    } 
}

function obstacleMovement() {
    obstacle.x += OBSTACLE_SPEED
    if (obstacle.x >= GAME_WIDTH) {
        obstacle.x = -obstacle.w;
        obstacle.y = (Math.floor(Math.random() * 8) * 16) + (GAME_HEIGHT / 2);
    } 
}

function obstacle2Movement() {
    obstacle2.x -= OBSTACLE_SPEED;
    if (obstacle2.x <= -obstacle2.w) {
        obstacle2.x = GAME_WIDTH;
        obstacle2.y = (Math.floor(Math.random() * 8) * 16) + (GAME_HEIGHT / 2);
    } 
}


// Checks for collisions between two objects
function collisionCheck(ob1, ob2) {
    // If the equations below are > 0, we know the second object (after minus) is between the first object's position and width
    var x1 = ob1.x + ob1.w - ob2.x;
    var x2 = ob2.x + ob2.w - ob1.x;
    var y1 = ob1.y + ob1.h - ob2.y;
    var y2 = ob2.y + ob2.h - ob1.y;
    if (((x1 > 0 && x1 <= ob1.w) || (x2 > 0 && x2 <= ob2.w))
        && ((y1 > 0 && y1 <= ob1.h)|| (y2 > 0 && y2 <= ob2.h))) 
    {
        return true;
    }
}

function gameLoop(timestamp) {
    var deltaTime = timestamp - lastTime; //Use this when time is needed for other functions
    lastTime = timestamp;
    input();
    if (!gameOver) {

        playerMovement(deltaTime);
        pickupMovement();
        obstacleMovement();
        obstacle2Movement();
        draw();
        var check = collisionCheck(player, obstacle);
        if (check) {
            gameOver = true;
        }
        check = collisionCheck(player, obstacle2);
        if (check) {
            gameOver = true;
        }
        check = collisionCheck(player, pickup);
        if (check) {
            score++;
            pickup.y = -PICKUP_HEIGHT;
            pickup.x = (Math.floor(Math.random() * 16) * 16);
        }
    } else if (gameOver && !displayScore) {
        displayScore = true;
        // Need alert outside of previous if, otherwise it 
        //gets triggered before draw, making it appear 
        //like the player lost without touching an obstacle block
        alert('Final Score: ' + score);
    }
    // Allows gameLoop to be called repeatedly
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);