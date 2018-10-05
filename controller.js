var left = false;
var right = false;
var up = false;
var down = false;
var mouseX = 0;
var mouseX = 0;

document.onmousemove = function(evt){
    mouseX = evt.pageX;
    mouseY = evt.pageY;
}

document.onmousedown = function(evt){
    setPixel(Math.floor(mouseX / 29), Math.floor(mouseY / 25), "red");
}

document.onkeydown = function(evt){
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
        selectSlot(1);
    }
    if(evt.key == "2"){
        selectSlot(2);
    }
    if(evt.key == "3"){
        selectSlot(3);
    }
    if(evt.key == "4"){
        selectSlot(4);
    }
    if(evt.key == "5"){
        selectSlot(5);
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
