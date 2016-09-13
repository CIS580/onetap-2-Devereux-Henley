(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Enemy = require('./enemy.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 382, y: 460});
var enemies = [];
var firstEnemy = new Enemy({x: 0, y: 200}, 'assets/kultist/kultist down.png');

enemies.push(firstEnemy);

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  for (var idx in enemies) {
    enemies[idx].update(elapsedTime);
  }
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
  for (var idx in enemies) {
    enemies[idx].render(elapsedTime, ctx);
  }
}

},{"./enemy.js":2,"./game.js":3,"./player.js":4}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Enemy class
 */
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Creates a new enemy object
 * @param {Postition} position object specifying an x and y
 */
function Enemy(position, src) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 16;
  this.height = 16;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI(src);
  this.state = "walking";

  var self = this;
}

/**
 * @function updates the enemy object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Enemy.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  switch (this.state) {
    case "walking":
      if(this.timer > 1000/16) {
        this.frame = (this.frame + 1) % 4;
      }
      this.x +=1;
      break;
  }
}

Enemy.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    0, 0, this.width, this.height,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 16;
  this.height = 16;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/link/not link/notlink up.png');
  this.state = "waiting";

  var self = this;
  window.onmousedown = function(event) {
    if(self.state == "waiting") {
      self.x = event.clientX;
      self.state = "walking";
    }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  switch (this.state) {
    case "walking":
      if(this.timer > 1000/16) {
        this.frame = (this.frame + 1) % 4;
      }
      this.y -= 1;
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    0, 0, this.width, this.height,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}]},{},[1]);
