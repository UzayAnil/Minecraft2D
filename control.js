var left = false;
var right = false;
var up = false;
var down = false;
var mouseX = 0;
var mouseX = 0;

setTimeout(() => {
    document.onmousemove = onMouseMove;
    document.onmousedown = onMouseDown;
    document.onkeydown = onKeyDown;
}, 500)

function onMouseMove(evt){
    mouseX = evt.pageX;
    mouseY = evt.pageY;
}

function onMouseDown(evt){
    setPixel(Math.floor(mouseX / 29), Math.floor(mouseY / 25), "red");
}

function onKeyDown(evt){
    if(evt.key == "a"){
        left = true;
    }
    if(evt.key == "d"){
        right = true;
    }
    if(evt.key == "w"){
        up = true;
    }
    if(evt.key == "s"){
        down = true;
    }
    if(evt.key == "1"){
        player.selectSlot(1);
    }
    if(evt.key == "2"){
        player.selectSlot(2);
    }
    if(evt.key == "3"){
        player.selectSlot(3);
    }
    if(evt.key == "4"){
        player.selectSlot(4);
    }
    if(evt.key == "5"){
        player.selectSlot(5);
    }
}

document.onkeyup = function(evt){
    if(evt.key == "a"){
        left = false;
    }
    if(evt.key == "d"){
        right = false;
    }
    if(evt.key == "w"){
        up = false;
    }
    if(evt.key == "s"){
        down = false;
    }
}
