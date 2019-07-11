var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var images = []; //Array of loaded images
var totalResources = 7; 
var resourcesLoaded = 0;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var mouseX = 0;
var mouseY = 0;
var camX;
var camY;
var player = new character(canvas.width / 2 + 550, canvas.height / 2);
var selectedBlock;
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
    if (resourcesLoaded == totalResources) {
        console.log("Resources have loaded.");
        start();
    }
}

function start() {
    requestAnimationFrame(update);
    generateMap();
    selectedBlock = map[0][0];
    draw();
}

function update() {
    player.movementSpeed = 4;
    player.block = map[Math.floor((player.x + 16) / 64)][Math.floor((player.y + 16) / 64)];
    if(player.block.type == "water") player.movementSpeed = 1;
    requestAnimationFrame(update);
    if (left) { //Check if there is a solid block on the way of the player.
        if (map[Math.floor(player.x / 64)][Math.floor(player.y / 64)].solid == false && map[Math.floor(player.x / 64)][Math.floor((player.y + player.width) / 64)].solid == false) {
            player.move(-1 * player.movementSpeed);
        }
    }
    if (right) {
        if (map[Math.floor((player.x + player.width) / 64)][Math.floor(player.y / 64)].solid == false && map[Math.floor((player.x + player.width) / 64)][Math.floor((player.y + player.width) / 64)].solid == false) {
            player.move(player.movementSpeed);
        }
    }
    if (up) {
        if (map[Math.floor(player.x / 64)][Math.floor(player.y / 64)].solid == false && map[Math.floor((player.x + player.width) / 64)][Math.floor((player.y / 64))].solid == false) {
            player.move(0, -1 * player.movementSpeed);
        }
    }
    if (down) {
        if (map[Math.floor(player.x / 64)][Math.floor((player.y + player.width) / 64)].solid == false && map[Math.floor((player.x + player.width) / 64)][Math.floor((player.y + player.width) / 64)].solid == false) {
            player.move(0, player.movementSpeed);
        }
    }
    draw();
}

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the viewport after the matrix is reset

    //Clamp the camera position to the world bounds while centering the camera around the player                                             
    camX = clamp(-player.x + canvas.width / 2, -3000, 0);
    camY = clamp(-player.y + canvas.height / 2, -3000, 0);
    ctx.translate(camX, camY);
    for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
            ctx.drawImage(images[map[x][y].type], x * 64, y * 64, 64, 64); //Draw blocks
            if (x == selectedBlock.x && y == selectedBlock.y) {
                rectStroke(x * 64, y * 64, 64, 64); //Black frame for selected block
            }
        }
    }
    ctx.drawImage(images["player"], player.x, player.y, player.width, player.width); //Player
    for (i = 0; i < player.slots.length; i++) { //Draw item slots
        if (player.slots[i].selected) {
            ctx.drawImage(images["slot_selected"], 450 - camX + (i + 1) * 75, canvas.height - 100 - camY, 50, 50);
        } else {
            ctx.drawImage(images["slot"], 450 - camX + (i + 1) * 75, canvas.height - 100 - camY, 50, 50);
        }
        if (player.slots[i].item != null) { //Draw the item inside the slot
            ctx.drawImage(images[player.slots[i].item.name + "_item"], 460 - camX + (i + 1) * 75, canvas.height - 90 - camY, 30, 30);
            drawText(player.slots[i].item.count, 480 - camX + (i + 1) * 75, canvas.height - 60 - camY, 20, "white", true);
        }
    }
}

function drawText(text, x, y, fontSize, color, bold = false){
    ctx.font = fontSize + "px Arial";
    if(bold) ctx.font += " bold";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
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
        if (player.slots[player.selectedSlot()].item != null) {
            if (player.slots[player.selectedSlot()].item.placeable && !selectedBlock.solid) { //Check if item is placeable and selected block is not solid
                selectedBlock.replace(new Block(selectedBlock.x, selectedBlock.y, player.slots[player.selectedSlot()].item.name, player.slots[player.selectedSlot()].item.solid));
                if(player.slots[player.selectedSlot()].item.count > 1){
                    player.slots[player.selectedSlot()].item.count -= 1;
                } else {
                    player.slots[player.selectedSlot()].item = null;
                }
            }
        } else {
            if (selectedBlock.type != "water") {
                if(selectedBlock.type == "tree"){
                    selectedBlock.remove();
                    player.give("wood");
                    return
                } 
                if(selectedBlock.type == "wood"){
                    selectedBlock.remove();
                    player.give("wood");
                    return;
                }
            }
        }
    }
}

function onMouseMove(evt) {
    mouseX = evt.pageX - camX;
    mouseY = evt.pageY - camY;
    let x = Math.floor(mouseX / 64);
    let y = Math.floor(mouseY / 64);
    selectedBlock = map[x][y];
    console.log(selectedBlock.type);
}

setTimeout(() => {
    document.onmousemove = onMouseMove;
    document.onmousedown = onClick;
}, 500);

function clamp(value, min, max) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
}