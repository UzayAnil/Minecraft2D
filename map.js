var map = [];
var waterDensity = 0;
var treeDensity = 0;
function generateMap(){
    waterDensity = random(1,4);
    generateGrass();
    generateWater();
    generateTree();
}

function generateGrass(){
    for(x = 0; x < 70; x++){
        var newline = [];
        for(y = 0; y < 70; y++){
            newline.push("grass"); //Generating a 70 blocks long grass line
        }
        map.push(newline); //Pushing that new line to the map (Doing that 70 times to generate a 70x70 map)
    }
}

function generateTree(){
    //Generating random trees on grass blocks
    forEachblock(function(block){
        if(block.type == "grass"){
            if(random(1,35) == 1){
                setblock(block.x,block.y,"tree");
            }
        }
    })  
}

function generateWater(){
    var density = 1000 - waterDensity;

    for(i = 0; i < waterDensity; i ++){
        setblock(random(0,64), random(0,36), "water"); //Generating water roots at random places
    }

    for(i = 0; i < 10; i++){
        forEachblock(function(block){
            if(block.type == "water"){
                var randomx = 0;
                var randomy = 0;
                if(random(0,1) == 1){
                    randomx = random(-1,1);
                }
                else{
                    randomy = random(-1,1);
                }
                if(block.x + randomx < 64 && block.y + randomy < 36){
                    setblock(block.x + randomx, block.y + randomy, "water"); //Expanding water roots randomly to make them look like a lake
                }
                
            }
        })
    }
}

//A function to reduce effort when iterating over all blocks
function forEachblock(callback){
    for(forx = 0; forx < map.length; forx++){
        for(fory = 0; fory < map[forx].length; fory++){
            var block = {
                x: forx,
                y: fory,
                type: map[forx][fory]
            }
            callback(block);
        }
    }
}

//an alternative to " map[x][y] = ... "
function setblock(x,y,block){
    try{
        map[x - 1][y - 1] = block;
    }
    catch(ex){
       // console.log(ex);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}