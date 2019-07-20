var world = [];
var waterDensity = 0;
var treeDensity = 0;
var worldSize = 64;

function generateWorld() {
    waterDensity = random(1, 4);
    generateGrass();
    generateWater();
    generateTree();
}

function generateGrass() {
    for (x = 0; x < worldSize; x++) {
        var newline = [];
        for (y = 0; y < worldSize; y++) {
            newline.push(blocks.grass); //Generating a 70 blocks long grass line
        }
        world.push(newline); //Pushing that new line to the world (Doing that 70 times to generate a 70x70 world)
    }
    console.log(world);
}

function generateTree() {
    //Generating random trees on grass blocks
    for (x = 0; x < world.length; x++) {
        for (y = 0; y < world[x].length; y++) {
            if (world[x][y].name == "grass") {
                if (random(1, worldSize / 2) == 1) {
                    setBlock(x, y, blocks.tree);
                }
            }
        }
    }
}

function generateWater() {
    
}

//an alternative to " world[x][y] = ... "
function setBlock(x, y, block) {
    world[x][y] = block;
}

function removeBlock(x, y) {
    world[x][y] = blocks.grass;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}