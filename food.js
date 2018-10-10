class Food {
    constructor(field) {
        do {
            this.x = rand(0, field[0].length); //x is between 0 and field columns size
            this.y = rand(0, field.length); //y is between 0 and amount of lines
        } while (field[this.y][this.x] != 0);
    }
}

 function rand(min, max) {
     return Math.floor(Math.random() * (max - min)) + min;
 }

module.exports = Food;