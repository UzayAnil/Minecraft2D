function character(x,y){
    this.x = x;
    this.y = y;
    this.move = function(newx,newy){
        this.x = newx;
        this.y = newy;
    }
}