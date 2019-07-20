function character(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.movementSpeed = 4;
    this.selectedSlot = 0;
    this.inventory = [];
    this.block;
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
        if(player.inventory.includes(items[item])){
            player.inventory.forEach((element, index) => {
                if(element == items[item]){
                    this.inventory[index].count += 1;
                }
            })
        } else {
            this.inventory.push(items[item]);
        }
    }
}