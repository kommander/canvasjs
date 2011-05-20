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
  var _context = context,
  _ticking = false,
  _k,
  
  _lastTickTime = 0,
  _tickTimeDiff = 0,
  _tickTimeout = 0x0,
  
  _startTime = 0,
  _frameRate = frameRate,
  _frameRateTick = 1000 / frameRate,
  
  //Stats
  _fps = 0,
  
  _clearContext = function(c){
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  },
  _switchObject = {
    showInfo: function(){},
    tickStart: _clearContext
  },
  
  //The objects to render
  _objects = [],
  _removeObjects = [];
  
  /**
   * Sets if the frame info is rendered each tick
   */
  this.showInfo = function(show, draw){
    _switchObject.showInfo = (show) ? _drawInfo : (typeof(draw) == 'function') ? draw : function(){};
    return this;
  };
  
  /**
   * Sets what happens when we enter a tick
   * By default the loop clears the canvas context
   */
  this.tickStart = function(clear, what){
    _switchObject.tickStart = (clear) ? _clearContext : (typeof(what) == 'function') ? what : function(){};
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
  this.push = function(object){
    if(_validateObject(object))
      _objects.push(object);
    return this;
  };
  
  /**
   * Add an Object to the _front_
   */
  this.shift = function(object){
    if(_validateObject(object))
      _objects.shift(object);
    return this;
  };
  
  /**
   * Add a new object _before_ an existing one
   */
  this.addBefore = function(object, before){
    if(_validateObject(object) && _objects.indexOf(before) != -1)
      _objects.splice(_objects.indexOf(before), 0, object);
    return this;
  };
  
  /**
   * Add a new object _after_ an existing one
   */
  this.addAfter = function(object, after){
    if(_validateObject(object) && _objects.indexOf(after) != -1)
      _objects.splice(_objects.indexOf(after) + 1, 0, object);
    return this;
  };
  
  /**
   * Remove an Object from the loop
   */
  this.remove = function(object){
    if(_objects.indexOf(object) != -1){
      if(!_ticking){
        _remove(object);
      } else {
        _removeObjects.push(object);
      }
    }
    return this;
  };
  
  /**
   * Do the removal
   */
  var _remove = function(object) {
    _objects.splice(_objects.indexOf(object), 1);
  };
  
  /**
   * The main loop, here the objects are rendered if visible
   */
  var _tick = function() {
    _ticking = true;
    _tickTimeDiff = -_lastTickTime + (_lastTickTime = Date.now());
    
    _switchObject.tickStart(_context, _tickTimeDiff);
    
    for(var _k = 0; _k < _objects.length; _k++) {
      _objects[_k].tick.call(_objects[_k], _context, _tickTimeDiff);
    }
    
    _fps = Math.round(1000 / _tickTimeDiff);
    _switchObject.showInfo.call(this);
    
    _ticking = false;
    
    while(_removeObjects.length > 0) {
      _remove(_removeObjects.shift());
    }
  };
  
  /**
   * start the loop
   */ 
  this.start = function() {
    _startTime = _lastTickTime = Date.now();
    clearInterval(_tickTimeout);
    _tickTimeout = setInterval(_tick, _frameRateTick);
    return this;
  };
  
  /**
   * stop the loop
   */
  this.stop = function() {
    clearInterval(_tickTimeout);
    return this;
  };
  
  /**
   * set the max desired framerate for the loop
   */
  this.frameRate = function(fps) {
    _frameRate = fps;
    _frameRateTick = 1000 / _frameRate;
    this.start();
    return this;
  };
  
  /** 
   * Access the current FPS
   */
  this.fps = function(){
    return _fps;
  };
  
  /**
   * Checks if the object we want to add has a tick method we can call in the loop
   */
  var _validateObject = function(object) {
    if(typeof(object.tick) == 'function'){ return true; }
    else { throw new Error('Objects must provide the public method tick.'); }
  };
  
  /**
   * Draws the information string on the canvas if showInfo is true
   */
  var _drawInfo = function() {
    _context.save();
    _context.font = '800 10px Helvetica, Arial, sans-serif';
    _context.fillStyle = '#009999';
    _context.fillText(_objects.length + ' Objects ' + _fps + ' FPS', 5, 10);
    _context.restore();
  }; 
}