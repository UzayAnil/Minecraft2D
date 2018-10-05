var slots = [];
for(i = 0; i < 5; i++){
    slots.push(new slot());
}
selectSlot(1);

function slot(){
    this.item = null;
    this.count = 0;
    this.selected = 0;
}

function selectSlot(number){
    number -= 1;
    for(i = 0; i < slots.length; i++){
        slots[i].selected = 0;
    }
    slots[number].selected = 1;
}

function selectedSlot(){
    for(i = 0; i < slots.length; i++){
        if(slots[i].selected){
            return(i);
        }
    }
}