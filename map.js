var map = [];
var waterDensity = 0;
var treeDensity = 0;
var mapSize = 70;

function generateMap() {
    waterDensity = random(1, 4);
    generateGrass();
    generateWater();
    generateTree();
}

function generateGrass() {
    for (x = 0; x < mapSize; x++) {
        var newline = [];
        for (y = 0; y < mapSize; y++) {
            newline.push(new Block(x, y, "grass", false)); //Generating a 70 blocks long grass line
        }
        map.push(newline); //Pushing that new line to the map (Doing that 70 times to generate a 70x70 map)
    }
}

function generateTree() {
    //Generating random trees on grass blocks
    forEachBlock(block => {
        if (block.type == "grass") {
            if (random(1, mapSize / 2) == 1) {
                setBlock(new Block(block.x, block.y, "tree"));
            }
        }
    })
}

function generateWater() {
    let lakeCenters = [];
    for(i = 0; i < 3; i++){
        lakeCenters.push({x: random(0, mapSize - 1), y: random(0, mapSize - 1)})
    }
    for(i = 0; i < lakeCenters.length; i++){
        setBlock(new Block(lakeCenters[i].x, lakeCenters[i].y, "water", false));
    }
    for(i = 0; i < 5; i++){
        forEachBlock(b => {
            if(b.type == "water"){
                let direction = random(1, 4);
                try{
                    if(direction == 1) setBlock(new Block(b.x - 1, b.y, "water", false));
                    if(direction == 2) setBlock(new Block(b.x, b.y - 1, "water", false));
                    if(direction == 3) setBlock(new Block(b.x + 1, b.y, "water", false));
                    if(direction == 4) setBlock(new Block(b.x, b.y + 1, "water", false));
                }
                catch(ex){

                }
            }
        })
    }
    console.log(lakeCenters);
}

//A function to reduce effort when iterating over all blocks
function forEachBlock(callback) {
    for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
            callback(map[x][y]);
        }
    }
}

//an alternative to " map[x][y] = ... "
function setBlock(block) {
    map[block.x][block.y] = block;
}

function Block(x, y, type, solid = true) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.solid = solid;
    this.remove = function(){
        map[this.x][this.y].type = "grass";
        map[this.x][this.y].solid = false;
    }
    this.replace = function(block){
        map[this.x][this.y] = block;
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}