//Create the world
// 0 = empty, 1 = coin, 2 = brick, 3 = cherry

/*
var world = [
    [2,2,2,2,2,2,2,2,2,2],
    [2,0,1,2,1,1,1,1,1,2],
    [2,1,1,2,2,2,2,1,1,2],
    [2,1,0,2,1,1,1,1,1,2],
    [2,1,1,2,3,1,1,2,1,2],
    [2,1,1,1,1,1,1,2,3,2],
    [2,2,2,2,2,2,2,2,2,2]
];*/
var world = [[],[],[],[],[],[],[]];

var pacman = {
    x: 1,
    y: 1
}
var ghost = {
    x: 5,
    y: 3,
    xf: 0,
    yf: 0
}
var score = 0;
var availableScore = 0;
var life = 3;
var angle = 0;
var level = 1;
var numColWidth = 10;
var numColheight = 7;
var level = 1;
var pacmanDiesSound = new Audio("Pacman_die.wav");
var chompCoinSound = new Audio("Chomp.mp3");
var chompCherrySound = new Audio("Fruit.mp3")
var winSound = new Audio("win.mp3")

function createWorld () {
    for (var i=0; i<numColheight; i++){
        var randomNum = 0;

        for (var j=0; j<numColWidth; j++) {
            //left border
            if (world[j] == world[0]) { 
                world[i].push(2)
            }
            //top and bottom border
            else if (world[i] == world[0] || world[i] == world[numColheight-1] ) { 
                world[i].push(2)
            }
            //ghost start
            else if (world[i][j] == world[1][1] || world[i][j] == world[3][5]) { 
                world[i].push(1)
            }
            else {
                randomNum = Math.floor(Math.random() * 4)
                world[i].push(randomNum)
            }
        }
    }
    //right border
    for (var i=0; i<numColheight; i++){
        for (var j=numColWidth-1; j<numColWidth; j++) {
            world[i].push(2)
        }
    }
}

function displayWorld () {
    var output = "";

    for (var i=0; i<world.length; i++){
        output += "\n<div class='row'>\n"
        for (var j=0; j<world[i].length; j++) {
            if (world[i][j] == 3) {
                output += "<div class='cherry'></div>";
            }
            else if (world[i][j] == 2) {
                output += "<div class='brick'></div>";
            }
            else if (world[i][j] == 1) {
                output += "<div class='coin'></div>";
            }
            else if (world[i][j] == 0) {
                output += "<div class='empty'></div>";
            }
        }
        output += "\n</div>";
    }
    //console.log(output);
    document.getElementById('world').innerHTML = output;
}

function determineAvailableScore () {

    for (var i=0; i<world.length; i++){
        for (var j=0; j<world[i].length; j++) {
            if (world[i][j] == 3) {
                availableScore += 50
            }
            else if (world[i][j] == 1) {
                availableScore += 10
            }
        }
    }
}

function displayPacman () {
    document.getElementById('pacman').style.top = pacman.y * 50 + "px"
    document.getElementById('pacman').style.left = pacman.x * 50 + "px"
}

function displayGhost () {
    document.getElementById('ghost').style.top = ghost.y * 50 + "px"
    document.getElementById('ghost').style.left = ghost.x * 50 + "px"
}

function displayScore () {
    document.getElementById('score').innerHTML = score;
}

function displayLife () {
    document.getElementById('life').innerHTML = life;
}

//Start Game
createWorld();
displayWorld();
displayPacman();
displayGhost();
determineAvailableScore ()

//Pacman movement
document.onkeydown = function (e){
    //play chomp sound when moving
    chompCoinSound.play()

    //play chomp sound when eating a cherry
    if (world[pacman.y+1][pacman.x] == 3) {
        chompCherrySound.play()
    }
    //press left
    if(e.keyCode == 37 && world[pacman.y][pacman.x-1] != 2 && life > 0){
        angle = 180
        pacman.x --;
    }

    //press right
    else if(e.keyCode == 39 && world[pacman.y][pacman.x+1] != 2 && life > 0){
        angle = 0
        pacman.x ++;
    }

    //press up
    else if(e.keyCode == 38 && world[pacman.y-1][pacman.x] != 2 && life > 0){
        angle = 270
        pacman.y --;
    }

    //press down
    else if(e.keyCode == 40 && world[pacman.y+1][pacman.x] != 2 && life > 0){
        angle = 90
        pacman.y ++;
    }

    //hit a ghost
    if (pacman.x == ghost.x && pacman.y == ghost.y && life > 0) {
        life --
        pacman.x = 1
        pacman.y = 1
        ghost.x = 5
        ghost.y = 3
        angle = 0
        pacmanDiesSound.play()
        displayLife ();
        displayGhost()
    }

    //Game Over
    if (life == 0) {
        document.getElementById("game_over").style.display = "block";
    }

    //rotates image of pacman
    document.getElementById('pacman').style.transform = "rotate(" + angle + "deg)";

    //scoring
    if (world[pacman.y][pacman.x] == 1) {
        world[pacman.y][pacman.x] = 0;
        score += 10;
        displayWorld();
        displayScore();
    }
    else if (world[pacman.y][pacman.x] == 3){
        world[pacman.y][pacman.x] = 0;
        score += 50;
        displayWorld();
        displayScore();
    }
    
    displayPacman()

    //Determine if player has won
    if (score == availableScore) {
        document.getElementById("next_level").style.display = "block"
        document.getElementById("press_enter").style.display = "block"
        winSound.play()
    }

    //if use selects Enter after wining game
    if (e.keyCode == 13 &&score == availableScore) {
        nextLevel ();
    }
    console.log ("pacman " + pacman.x + " " + pacman.y)
    console.log ("ghost  " + ghost.x + " " + ghost.y)
    console.log (availableScore)
    console.log ("---------------------------------")
}

//Ghost movement
var ghostSpeed = 1000;
setInterval (ghostMovement, ghostSpeed);

function ghostMovement () {
    var ghostMoveX = Math.floor(Math.random() * 3);
    var ghostMoveY = Math.floor(Math.random() * 3);
    //console.log ("X " + ghostMoveX) 
    //console.log ("Y " + ghostMoveY)
    //console.log ("----------------------------")

    //set potential Ghost move: (0 = Do not move that direction | 1 = move left or Up | 2 = move right or down)
    if (ghostMoveX == 0 && ghostMoveY == 1) {
        ghost.xf = ghost.x
        ghost.yf = ghost.y - 1
    }
    else if (ghostMoveX == 0 && ghostMoveY == 2) {
        ghost.xf = ghost.x
        ghost.yf = ghost.y + 1
    }
    else if (ghostMoveX == 1 && ghostMoveY == 0) {
        ghost.xf = ghost.x - 1
        ghost.yf = ghost.y
    }
    else if (ghostMoveX == 2 && ghostMoveY == 0) {
        ghost.xf = ghost.x + 1
        ghost.yf = ghost.y
    }

    //check if movement is possible
    if(world[ghost.yf][ghost.xf] != 2){
        ghost.x = ghost.xf
        ghost.y = ghost.yf
        displayGhost()
    }

    //ghost hit pacman
    if (pacman.x == ghost.x && pacman.y == ghost.y && life > 0) {
        life --
        pacman.x = 1
        pacman.y = 1
        ghost.x = 5
        ghost.y = 3
        angle = 0
        pacmanDiesSound.play()
        displayLife ();
        displayPacman()
        displayGhost()
    }
    if (life == 0) {
        document.getElementById("game_over").style.display = "block";
    }
}

//Next Level
function nextLevel () {
    //clear the world array
    for (var i = world.length; i>0; i--){
        world.pop()
    }
    world = [[],[],[],[],[],[],[]];
    //clear the world div
    output = " "
    document.getElementById('world').innerHTML = output;
    //increase the screen size
    numColWidth += 2
    //hide the next level button and press enter
    document.getElementById("next_level").style.display = "none"
    document.getElementById("press_enter").style.display = "none"
    //increase the level #
    level += 1
    document.getElementById("level").innerHTML = level
    //reset pacman
    pacman.x=1
    pacman.y=1
    angle = 0
    document.getElementById('pacman').style.transform = "rotate(" + angle + "deg)";
    //reset ghost
    ghost.x=5
    ghost.y=3
    //make the ghost faster
    ghostSpeed = ghostSpeed - 100
    setInterval (ghostMovement, ghostSpeed);
    createWorld();
    displayWorld();
    displayPacman();
    displayGhost();
    determineAvailableScore ()
}