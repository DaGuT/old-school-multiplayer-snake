 class Snake {
     constructor(field) { //field is array of 0 and -1. -1 is obstacle, 0 is empty space
         this.segments = []; //array of x and y of each snake segment

         //we look for space without obstacles
         var x, y;

         do {
             x = rand(0, field[0].length); //x is between 0 and field columns size
             y = rand(0, field.length); //y is between 0 and amount of lines
         } while (field[y][x] != 0);

         this.segments.push({
             x,
             y
         }); //we spawn our snake there        

         this.dir = {
             x: 0,
             y: 0
         }; //this is where snake looks to move at next step

         this.maxX = field[0].length;
         this.maxY = field.length;
     }

     //obviusly, we get in message the direction and update our snake on server
     changeDirection(direction) {
         switch (direction) {
             case "up":
                 if (this.dir.y == 1) {
                     return
                 }
                 this.dir = {
                     x: 0,
                     y: -1
                 };
                 break;
             case "down":
                 if (this.dir.y == -1) {
                     return
                 }
                 this.dir = {
                     x: 0,
                     y: 1
                 };
                 break;
             case "left":
                 if (this.dir.x == 1) {
                     return
                 }
                 this.dir = {
                     x: -1,
                     y: 0
                 };
                 break;
             case "right":
                 if (this.dir.x == -1) {
                     return
                 }
                 this.dir = {
                     x: 1,
                     y: 0
                 };
                 break;
             default:
                 break;
         }
     }

     update() { //we calculate new snake position
         let segs = this.segments; //to make it easier and faster

         //I dont want to reverse array, so I will use for loop
         for (let i = segs.length - 1; i >= 1; --i) { //we update snake from the end. we dont update the head
             //we dont update if we have tail that is not tailed yet (after we ate)
             if (!(segs[i].x === segs[i - 1].x && segs[i].y === segs[i - 1].y)) {
                 segs[i].x = segs[i - 1].x;
                 segs[i].y = segs[i - 1].y;
             }
         }

         //now we update head and let snake go thrugh borders
         segs[0].x = (segs[0].x + this.dir.x);
         segs[0].y = (segs[0].y + this.dir.y);

         if (segs[0].x == -1) {
             segs[0].x = this.maxX - 1
         }
         if (segs[0].x == this.maxX) {
             segs[0].x = 0
         }
         if (segs[0].y == -1) {
             segs[0].y = this.maxY - 1
         }
         if (segs[0].y == this.maxY) {
             segs[0].y = 0
         }

     }

     eat(food) {
         if (food.x == this.segments[0].x && food.y == this.segments[0].y) {
             food.isEaten = true;
             this.grow({
                 x: food.x,
                 y: food.y
             }); //we increase snake Length
             return true;
         }
     }

     checkIfDied(snakes, field) {
         let seg = {}; 
         seg.x=this.segments[0].x + this.dir.x;
         seg.y=this.segments[0].y + this.dir.y;
         
         if (seg.x == -1) {
             seg.x = this.maxX - 1
         }
         if (seg.x == this.maxX) {
             seg.x = 0
         }
         if (seg.y == -1) {
             seg.y = this.maxY - 1
         }
         if (seg.y == this.maxY) {
             seg.y = 0
         }
         
         if (field[seg.y][seg.x] == -1) {
             this.died = true;
             return true;
         }

         for (i in snakes) {
             let snake = snakes[i];
             if (snake != this) {
                 snake.segments.forEach((segment) => {
                     if (seg.x == segment.x && seg.y == segment.y) {
                         this.died = true;
                         return true;
                     }
                 });
             } else {
                 for (let i = 1; i < snake.segments.length; ++i) {
                     if (seg.x == this.segments[i].x && seg.y == this.segments[i].y) {
                         this.died = true;
                         return true;
                     }
                 }
             }
         }

         return false;
     }

     grow(position) {
         this.segments.push(position);
     }

     toJSON() {
         return this.segments;
     }
 }

 function rand(min, max) {
     return Math.floor(Math.random() * (max - min)) + min;
 }

 module.exports = Snake;
