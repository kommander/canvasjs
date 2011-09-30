/**
 * Loop.js
 * A simple animation loop for HTML5 canvas
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 *
 * TODO: implement timed property animation
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.Loop = function(context, frameRate)
{
  this._context = context;
  this._ticking = false;
  this._lastTickTime = 0;
  this._tickTimeDiff = 0;
  this._tickTimeout = null;
  this._startTime = 0;
  this._frameRate = frameRate || 60;
  this._frameRateTick = Math.round(1000 / this._frameRate);
  
  //Stats
  this._fps = 0;
      
  this._clearContext = function(c){
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  };

  this._switchObject = {
    showInfo: function(){},
    tickStart: this._clearContext
  };
  
  //The objects to render
  this._objects = [];
  this._removeObjects = [];
}

/**
 * Sets if the frame info is rendered each tick
 */
kk.Loop.prototype.showInfo = function(show, draw){
  this._switchObject.showInfo = (show) ? this._drawInfo : (typeof(draw) == 'function') ? draw : function(){};
  return this;
};

/**
 * Sets what happens when we enter a tick
 * By default the loop clears the canvas context
 */
kk.Loop.prototype.tickStart = function(clear, what){
  this._switchObject.tickStart = (clear) ? this._clearContext : (typeof(what) == 'function') ? what : function(){};
  return this;
};

/**
 * Add an Object to the render loop.
 * An Object has to provide at least the publich methods "draw" and "animate",
 * and the boolean attributes visible and paused.
 * A visible == true object will neither be animated nor drawn.
 * A paused == true object will just be drawn but not animated.
 * which will be provided with the 2D context,
 * otherwise it won't be added.
 */
kk.Loop.prototype.push = function(object){
  if(this._validateObject(object))
    this._objects.push(object);
  return this;
};

/**
 * Add an Object to the _front_
 */
kk.Loop.prototype.shift = function(object){
  if(this._validateObject(object))
    this._objects.shift(object);
  return this;
};

/**
 * Add a new object _before_ an existing one
 */
kk.Loop.prototype.addBefore = function(object, before){
  if(this._validateObject(object) && this._objects.indexOf(before) != -1)
    this._objects.splice(this._objects.indexOf(before), 0, object);
  return this;
};

/**
 * Add a new object _after_ an existing one
 */
kk.Loop.prototype.addAfter = function(object, after){
  if(this._validateObject(object) && this._objects.indexOf(after) != -1)
    this._objects.splice(this._objects.indexOf(after) + 1, 0, object);
  return this;
};

/**
 * Remove an Object from the loop
 */
kk.Loop.prototype.remove = function(object){
  if(this._objects.indexOf(object) != -1){
    if(!this._ticking){
      this._remove(object);
    } else {
      this._removeObjects.push(object);
    }
  }
  return this;
};

/**
 * Do the removal
 */
kk.Loop.prototype._remove = function(object) {
  this._objects.splice(this._objects.indexOf(object), 1);
};

/**
 * The main loop
 */
kk.Loop.prototype._tick = function() {
  if(!this._ticking){
    this._ticking = true;
    this._tickTimeDiff = -this._lastTickTime + (this._lastTickTime = Date.now());
    
    this._switchObject.tickStart(this._context, this._tickTimeDiff);
    
    for(var k = 0; k < this._objects.length; k++) {
      this._objects[k].tick.call(this._objects[k], this._context, this._tickTimeDiff);
    }
    
    this._fps = Math.round(1000 / this._tickTimeDiff);
    this._switchObject.showInfo.call(this, this._context, this._tickTimeDiff);
    
    this._ticking = false;
    
    while(this._removeObjects.length > 0) {
      this._remove(this._removeObjects.shift());
    }
  }
};

/**
 * start the loop
 */ 
kk.Loop.prototype.start = function() {
  if(this._tickTimeout === null){
    this._startTime = this._lastTickTime = Date.now();
    clearInterval(this._tickTimeout);
    this._tickTimeout = setInterval(function(t){
      t._tick();
    }, this._frameRateTick, this);
  }
  return this;
};

/**
 * stop the loop
 */
kk.Loop.prototype.stop = function() {
  clearInterval(this._tickTimeout);
  this._tickTimeout = null;
  return this;
};

/**
 * set the max desired framerate for the loop
 */
kk.Loop.prototype.frameRate = function(fps) {
  this._frameRate = fps;
  this._frameRateTick = Math.round(1000 / this._frameRate);
  this.stop();
  this.start();
  return this;
};

/** 
 * Access the current FPS
 */
kk.Loop.prototype.fps = function(){
  return this._fps;
};

/** 
 * How many objects are in the loop
 */
kk.Loop.prototype.size = function(){
  return this._objects.length;
};

/**
 * Checks if the object we want to add has a tick method we can call in the loop
 */
kk.Loop.prototype._validateObject = function(object) {
  if(typeof(object.tick) == 'function'){ return true; }
  else { throw new Error('Objects must provide the public method tick.'); }
};

/**
 * Draws the information string on the canvas if showInfo is true
 */
kk.Loop.prototype._drawInfo = function(context) {
  context.save();
  context.font = '800 10px Helvetica, Arial, sans-serif';
  context.fillStyle = '#009999';
  context.fillText(this._objects.length + ' Objects ' + this._fps + ' FPS', 5, 10);
  context.restore();
};