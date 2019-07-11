function character(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.movementSpeed = 4;
    this.move = function (movx = 0, movy = 0) {
        this.x += movx;
        this.y += movy;
    }
    this.teleport = function (newx, newy) {
        if (x && y) {
            this.x = newx;
            this.y = newy;
        }
    }
    this.give = function (item) {
        if (!item) return console.log("Missing parameter: item");
        if (!isNaN(item)) {
            return console.log("Item ids are not supported yet.");
        }
        for (i = 0; i < this.slots.length; i++) {
            if (this.slots[i].item) {
                if (this.slots[i].item.name == items[item].name) {
                    this.slots[i].item.count += 1;
                    return console.log(items[item].visualName + " has given to the player.")
                }
            }
        }
        for (i = 0; i < this.slots.length; i++) {
            if (!this.slots[i].item) {
                this.slots[i].item = items[item];
                this.slots[i].item.count = 1;
                return console.log(items[item].visualName + " has given to the player.");
            }
        }
    }
this.selectSlot = function (number) {
    number -= 1;
    for (i = 0; i < this.slots.length; i++) {
        this.slots[i].selected = false;
    }
    console.log("Selected Slot: " + number);
    this.slots[number].selected = true;
}
this.selectedSlot = function () {
    for (i = 0; i < this.slots.length; i++) {
        if (this.slots[i].selected) {
            return (i);
        }
    }
}
this.block;
this.slots = [];
for (i = 0; i < 5; i++) {
    this.slots.push(new Slot());
}
this.selectSlot(1);
}

function Slot() {
    this.item = null;
    this.selected = false;
}