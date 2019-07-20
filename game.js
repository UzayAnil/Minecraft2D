var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var images = {
    grass: null,
    water: null,
    tree: null,
    player: null,
    slot: null,
    slot_selected: null,
    wood_item: null,
    wood: null
};
var totalResources = Object.keys(images).length;
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
    for (var key in images) {
        loadImage(key);
    }
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
    generateWorld();
    selectedBlock = world[0][0];
    selectedBlock.x = 0;
    selectedBlock.y = 0;
    draw();
}

function update() {
    player.movementSpeed = 4;
    player.block = world[Math.floor((player.x + 16) / 64)][Math.floor((player.y + 16) / 64)];
    if (player.block.name == "water") player.movementSpeed = 1;
    requestAnimationFrame(update);
    if (left) { //Check if there is a solid block on the way of the player.
        if (world[Math.floor(player.x / 64)][Math.floor(player.y / 64)].solid == false && world[Math.floor(player.x / 64)][Math.floor((player.y + player.width) / 64)].solid == false) {
            player.move(-1 * player.movementSpeed);
        }
    }
    if (right) {
        if (world[Math.floor((player.x + player.width) / 64)][Math.floor(player.y / 64)].solid == false && world[Math.floor((player.x + player.width) / 64)][Math.floor((player.y + player.width) / 64)].solid == false) {
            player.move(player.movementSpeed);
        }
    }
    if (up) {
        if (world[Math.floor(player.x / 64)][Math.floor(player.y / 64)].solid == false && world[Math.floor((player.x + player.width) / 64)][Math.floor((player.y / 64))].solid == false) {
            player.move(0, -1 * player.movementSpeed);
        }
    }
    if (down) {
        if (world[Math.floor(player.x / 64)][Math.floor((player.y + player.width) / 64)].solid == false && world[Math.floor((player.x + player.width) / 64)][Math.floor((player.y + player.width) / 64)].solid == false) {
            player.move(0, player.movementSpeed);
        }
    }
    draw();
}

function clamp(value, min, max) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
}

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform matrix as it is cumulative
    fillRect(-10000, -10000, 200000, 200000, "lightblue"); //clear the viewport after the matrix is reset
    //Clamp the camera position to the world bounds while centering the camera around the player                                             
    //camX = clamp(-player.x + canvas.width / 2, -3000, 0);
    //camY = clamp(-player.y + canvas.height / 2, -3000, 0);

    camX = -player.x + canvas.width / 2
    camY = -player.y + canvas.height / 2
    ctx.translate(camX, camY);
    for (x = 0; x < world.length; x++) {
        for (y = 0; y < world[x].length; y++) {
            ctx.drawImage(images[world[x][y].name], x * 64, y * 64, 64, 64); //Draw blocks
            if (x == selectedBlock.x && y == selectedBlock.y) {
                rectStroke(x * 64, y * 64, 64, 64); //Black frame for selected block
            }
        }
    }
    ctx.drawImage(images["player"], player.x, player.y, player.width, player.width); //Player

    for (i = 0; i < 9; i++) {
        if (player.selectedSlot == i) {
            drawFixedImage(images.slot_selected, hotbar[i].x, hotbar[i].y, 50, 50);
        } else {
            drawFixedImage(images.slot, hotbar[i].x, hotbar[i].y, 50, 50);
        }
        if (player.inventory[i]) {
            drawFixedImage(images[player.inventory[i].name + "_item"], hotbar[i].x + 10, hotbar[i].y + 10, 30, 30);
            drawText(player.inventory[i].count, hotbar[i].x + 40, hotbar[i].y + 40, 15, "white", true, true, "right");
        }
    }
}

function drawFixedImage(img, x, y, width, height) {
    ctx.drawImage(img, x - camX, y - camY, width, height);
}


function drawText(text, x, y, fontSize = 15, color = "black", bold = false, fixed = false, align = "left") {
    ctx.font = fontSize + "px Arial";
    if (bold) ctx.font += " bold";
    ctx.fillStyle = color;
    ctx.textAlign = align;
    if(fixed){
        ctx.fillText(text, x - camX, y - camY);
    } else {
        ctx.fillText(text, x, y);
    }

}

function drawFixedText(text, x, y, fontSize, color, bold = false){
    ctx.font = fontSize + "px Arial";
    if (bold) ctx.font += " bold";
    ctx.fillStyle = color;
    ctx.textAlign = "right";
    ctx.fillText(text, x - camX, y - camY);
}

function fillRect(x, y, w, h, c = "black") {
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
    console.log(evt.button);
    //console.log("camX: " + camX + " camY: " + camY + " mouseX: " + mouseX + " mouseY: " + mouseY + " blockX: " + selectedBlock.x + " blockY: " + selectedBlock.y);
    //console.log(evt);
    if (Math.sqrt((player.x - mouseX) ** 2 + (player.y - mouseY) ** 2) < 250) { //If selected block is too far away from player, ignore.
        if (evt.button == "0") {
            if (selectedBlock.solid) {
                if (selectedBlock.name == "tree") {
                    removeBlock(selectedBlock.x, selectedBlock.y);
                    player.give("wood");
                    return
                }
                if (selectedBlock.name == "wood") {
                    removeBlock(selectedBlock.x, selectedBlock.y);
                    player.give("wood");
                    return;
                }
            }
        }
        if (evt.button == "2") {
            if (player.inventory[player.selectedSlot]) {
                if (player.inventory[player.selectedSlot].placeable && !selectedBlock.solid) { //Check if item is placeable and selected block is not solid
                    setBlock(selectedBlock.x, selectedBlock.y, blocks[player.inventory[player.selectedSlot].name]);
                    if (player.inventory[player.selectedSlot].count > 1) {
                        player.inventory[player.selectedSlot].count -= 1;
                    } else {
                        player.inventory.splice(player.selectedSlot, 1);
                    }
                }
            }
        }

    }
}

function onMouseMove(evt) {
    mouseX = evt.layerX - camX;
    mouseY = evt.layerY - camY;
    let x = Math.floor(mouseX / 64);
    let y = Math.floor(mouseY / 64);
    if (world[x]) {
        if (world[x][y]) {
            selectedBlock = world[x][y];
            selectedBlock.x = x;
            selectedBlock.y = y;
        }
    }
    //console.log(selectedBlock.type);
}

setTimeout(() => {
    document.onmousemove = onMouseMove;
    document.onmousedown = onClick;
}, 500);

function playSound(sound) {
    let audio = new Audio('audio/' + sound + ".mp3");
    audio.play();
}