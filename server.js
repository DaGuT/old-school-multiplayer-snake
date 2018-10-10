const Snake = require('./snake.js');
const Food = require('./food.js');

// Setup basic express server
var express = require('express');
var port = process.env.PORT || 8080;
var server = require('http').createServer().listen(port, '0.0.0.0');
var io = require('socket.io')(server);

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

let frameRate = 10;

let snakes = [];

let width = 32;
let height = 32;

let field = Array(height).fill(Array(width).fill(0)); //Field without any obstacles

let food = new Food(field);

io.on('connection', (socket) => {

    var isAdded = false;
    var snake;

    console.log(`${new Date()}
  user connected with sid: ${socket.id}`);

    socket.emit("field", field); //we send current field to the client so that he can pre-draw it
    socket.emit("new food", food);

    // if user connects/reconnects he will emit 'add snake'
    socket.on('loaded', () => {
        if (isAdded)
            return; // if snake is already in the list we do nothing

        console.log('Snake was added');

        isAdded = true; //we say that we have added snake for the socket id

        //on add snake user adds snake to the server snake pool

        snakes[socket.id] = new Snake(field); //we add this snake to the 'array'.

        // we let everyone know that there is a new snake (to update numUsers displayed)
        io.emit('player status', snakes.length);

    });

    socket.on('change direction', (direction) => {
        if(snakes[socket.id]) snakes[socket.id].changeDirection(direction);
    });

    socket.on('disconnect', () => {
        if (isAdded) {

            console.log(`snake disconnected. Sid: ${socket.id}`);

            delete snakes[socket.id]; //we delete snake upon disconnect, as I have told at the beggining

            // echo globally that this client has left
            io.emit('player status', snakes.length);
        }
    });
});

//this is the main function where the whole game happens
function gameTick() {
    //we update snakes positions
    for (i in snakes) {
        let _snake = snakes[i];
        _snake.checkIfDied(snakes, field);
        _snake.update();
        _snake.eat(food);
    }

    //I dont create new snakes in the same loop as the first to check will respawn, and the other will stay alive in case face-to-face meeting
    for (i in snakes) {
        let _snake = snakes[i];
        if (_snake.died) {
            console.log('yeah');
            snakes[i] = new Snake(field);}
    }

    //we let every player know about new food location
    if (food.isEaten) {
        food = new Food(field);
        io.emit('new food', food);
    }

    let _snakes = [];
    for (let i in snakes) {
        _snakes.push(snakes[i].toJSON());
    }

    //we send new snakes positions
    io.emit('snake tick', _snakes);
}

setInterval(gameTick, 1000 / frameRate);

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
