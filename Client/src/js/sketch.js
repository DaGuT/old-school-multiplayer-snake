let field;
let food;
let snakes;

function setup() {
    createCanvas(innerWidth, innerHeight);

    socket = io("http://localhost:8080");

    socket.on('connect', () => {
        console.log('connected');
    });

    //here we received field, now we can draw our field
    socket.on('field', _field => {
        field = _field;

        console.log("field received");

        segmentHeight = height / field.length;
        segmentWidth = width / field[0].length;

        drawField();

        socket.emit('loaded');

    });

    //every game tick we get that snakes info
    socket.on('snake tick', _snakes => {
        snakes = _snakes;
    });

    socket.on('new food', _food => {
        food = _food;
    });





    socket.on('player status', (numpl) => {
        console.log(numpl)
    })
}

function draw() {
    background(51);

    drawField();
}


function keyPressed() {

    if (keyCode === LEFT_ARROW) {
        socket.emit('change direction', 'left');
    }
    if (keyCode === RIGHT_ARROW) {
        socket.emit('change direction', 'right');
    }
    if (keyCode === UP_ARROW) {
        socket.emit('change direction', 'up');
    }
    if (keyCode === DOWN_ARROW) {
        socket.emit('change direction', 'down');
    }

}

let oldX, oldY;

function touchStarted() {
    oldX = mouseX;
    oldY = mouseY;
}

function touchEnded() {
    let dX = Math.abs(mouseX - oldX);
    let dY = Math.abs(mouseY - oldY);

    if (max(dX, dY) == dX) { //if we swiped horizontally
        if ((mouseX - oldX) > 0) socket.emit('change direction', 'right');
        else socket.emit('change direction', 'left');
    } else {
        if ((mouseY - oldY) > 0) socket.emit('change direction', 'down');
        else socket.emit('change direction', 'up');
    }
}


function drawField() {

    if (socket.connected) {
        stroke(126);
        if (field) {
            for (let i = 1; i < field.length; ++i) {
                for (let j = 1; j < field[0].length; ++j) {
                    line(j * segmentWidth, 0, j * segmentWidth, height);
                }
                line(0, i * segmentHeight, width, i * segmentHeight);
            }
        }

        //we draw food
        if (food) {
            fill(200);
            rect(food.x * segmentWidth, food.y * segmentHeight, segmentWidth, segmentHeight);
        }

        if (snakes) {
            snakes.forEach((snake) => {
                Snake.draw(snake);
            });
        }
    }
}
