var left = false;
var right = false;
var up = false;
var down = false;

setTimeout(() => {
    document.onkeydown = onKeyDown;
}, 500)

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
        player.selectedSlot = 0;
    }
    if(evt.key == "2"){
        player.selectedSlot = 1;
    }
    if(evt.key == "3"){
        player.selectedSlot = 2;
    }
    if(evt.key == "4"){
        player.selectedSlot = 3;
    }
    if(evt.key == "5"){
        player.selectedSlot = 4;
    }
    if(evt.key == "6"){
        player.selectedSlot = 5;
    }
    if(evt.key == "7"){
        player.selectedSlot = 6;
    }
    if(evt.key == "8"){
        player.selectedSlot = 7;
    }
    if(evt.key == "9"){
        player.selectedSlot = 8;
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
