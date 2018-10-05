var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var images = []; //Array of loaded images
var totalResources = 7; //total images to load
var resourcesLoaded = 0; //loaded images count
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var mouseX = 0;
var mouseY = 0;
var camX;
var camY;
var player = new character(canvas.width / 2 + 550, canvas.height / 2);
var solidBlocks = ["wood", "tree"]; //Blocks that collide with player
loadImages();

function loadImages() {
    loadImage("grass");
    loadImage("water");
    loadImage("tree");
    loadImage("player");
    loadImage("slot");
    loadImage("slot_selected");
    loadImage("wood_item");
    loadImage("wood");
}

function loadImage(name) {
    images[name] = new Image();
    images[name].onload = function () {
        resourceLoaded();
    }
    images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {
    resourcesLoaded += 1;
    if (resourcesLoaded == totalResources) { //Check if all images are loaded
        console.log("Resources have loaded.");
        start(); //If image loading is done start the game
    }
}

var selectedblock = {
    x: 0,
    y: 0,
    type: 0,
    distance: 0,
    remove() {
        this.x = 0;
        this.y = 0;
        this.type = 0;
        this.distance = 0;
    }
}

function start() {
    requestAnimationFrame(update); //Trigger update function every frame
    generateMap();
    draw();
    slots[0].item = new wood(); //Give the player a wood at the starting of game
}

function update() {
    var ms = 4; //Movement speed
    if(map[Math.floor((player.x + 16) / 64)][Math.floor((player.y + 16) / 64)] == "water") ms = 1; //If player is on water reduce the movement speed
    requestAnimationFrame(update);
    if (left) {
        //Check the left block of the player. If there is a solid block on the left, prevent him from moving to left. 
        if (!solidBlocks.includes(map[Math.floor(player.x / 64)][Math.floor(player.y / 64)]) && !solidBlocks.includes(map[Math.floor(player.x / 64)][Math.floor((player.y + 32) / 64)])) {
            player.x -= ms;
        }
    }
    if (right) {
        //Check the right block of the player. If there is a solid block on the right, prevent him from moving to right. 
        if (!solidBlocks.includes(map[Math.floor((player.x + 32) / 64)][Math.floor(player.y / 64)]) && !solidBlocks.includes(map[Math.floor((player.x + 32) / 64)][Math.floor((player.y + 32) / 64)])) {
            player.x += ms;
        }
    }
    if (up) {
        //Check the top block of the player. If there is a solid block on the top, prevent him from moving to top. 
        if (!solidBlocks.includes(map[Math.floor(player.x / 64)][Math.floor(player.y / 64)]) && !solidBlocks.includes(map[Math.floor((player.x + 32) / 64)][Math.floor((player.y / 64))])) {
            player.y -= ms;
        }
    }
    if (down) {
        //Check the bottom block of the player. If there is a solid block on the bottom, prevent him from moving down. 
        if (!solidBlocks.includes(map[Math.floor(player.x / 64)][Math.floor((player.y + 32) / 64)]) && !solidBlocks.includes(map[Math.floor((player.x + 32) / 64)][Math.floor((player.y + 32) / 64)])) {
            player.y += ms;
        }
    }
    draw();
}

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the viewport after the matrix is reset

    //Clamp the camera position to the world bounds while centering the camera around the player                                             
    camX = clamp(-player.x + canvas.width / 2, -3000, 500 - canvas.width);
    camY = clamp(-player.y + canvas.height / 2, -3000, 764 - canvas.height);
    ctx.translate(camX, camY);
    for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
            ctx.drawImage(images[map[x][y]], x * 64, y * 64, 64, 64); //Draw blocks
            if (x == selectedblock.x && y == selectedblock.y) {
                rectStroke(x * 64, y * 64, 64, 64); //Draw the selected block
            }
        }
    }
    ctx.drawImage(images["player"], player.x, player.y, 32, 32); //Draw the steve(player)
    for (i = 0; i < slots.length; i++) { //Draw item slots
        if (slots[i].selected) {
            ctx.drawImage(images["slot_selected"], 450 - camX + (i + 1) * 75, canvas.height - 100 - camY, 50, 50);
        } else {
            ctx.drawImage(images["slot"], 450 - camX + (i + 1) * 75, canvas.height - 100 - camY, 50, 50);
        }
        if (slots[i].item != null) { //Draw the item inside the slot
            ctx.drawImage(images[slots[i].item.name + "_item"], 460 - camX + (i + 1) * 75, canvas.height - 90 - camY, 30, 30)
        }
    }
}

function rectFill(x, y, w, h, c = "black") {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
}

function rectStroke(x, y, w, h, c = "black", lw = 1) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = c;
    ctx.strokeRect(x, y, w, h);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function onClick(evt) {
    if (Math.sqrt((player.x - mouseX) ** 2 + (player.y - mouseY) ** 2) < 250) { //If selected block is too far away from player, ignore.
        if (slots[selectedSlot()].item != null) { //Check if a slot with item is selected.
            if (slots[selectedSlot()].item.placeable && !solidBlocks.includes(map[selectedblock.x][selectedblock.y])) { //Check if item is placeable and selected block is not solid
                map[selectedblock.x][selectedblock.y] = slots[selectedSlot()].item.name; //Set the selected block to selected item
            }
        } else {
            if (selectedblock.type != "water") {
                setblock(selectedblock.x + 1, selectedblock.y + 1, "grass"); //Break the selected block by setting it to grass.
            }
        }
    }
}

function onMouseMove(evt) {
    mouseX = evt.pageX - camX; //Find the position of mouse in canvas.
    mouseY = evt.pageY - camY;
    selectedblock.x = Math.floor(mouseX / 64); //Find what block mouse is on
    selectedblock.y = Math.floor(mouseY / 64);
    selectedblock.type = map[selectedblock.x][selectedblock.y];
    selectedblock.distance = Math.sqrt((player.x - mouseX) ** 2 + (player.y - mouseY) ** 2); //Find the distance between player and the selected block
}

document.onmousemove = onMouseMove;
document.onmousedown = onClick;

function clamp(value, min, max) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
}

