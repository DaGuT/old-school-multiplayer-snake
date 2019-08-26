# old-school-multiplayer-snake
It will not be finished. We had nothing to do, so I wrote this buggy snake to play with my friends. 

All the logic is handled on server, so you can deal without it.

It's the most simple snake with rectangle blocks. You can eat food and go in front of you friends to block them, so they will loose their snake and start from the beginning. That simple and fun!
____

Stack used for this app is:
*socket.io - for websockets and making it multiplayer
*p5.js - for canvas drawings

______

If you want to run your own server, do 
```
node server.js
```

Edit "Client/src/js/sketch.js" by chaning 
```
socket = io("http://localhost:8080");
```
to your server adress. Host/send client folder and play with your friends :)

______

Sometimes demo server is up and you can go to http://demos.dagut.ru/snake with your friends and play xD
