/**
 * Loop.js
 * A simple animation loop for HTML5 canvas
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 */
function Loop(canvas, frameRate)
{
  var _canvas = canvas,
  _context = _canvas.getContext('2d'),
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
  _infoFont = '800 10px Helvetica, Arial, sans-serif';
  _switchObject = {
    showInfo: function(){}
  }
  
  //The objects to render
  _objects = [],
  _removeObjects = [];
  
  this.showInfo = function(show){
    if(show)
      _switchObject.showInfo = _drawInfo;
    else
      _switchObject.showInfo = function(){};
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
  this.add = function(object){
    if(_validateObject(object))
      _objects.push(object);
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
  var _tick = function(){
    _ticking = true;
    _tickTimeDiff = -_lastTickTime + (_lastTickTime = Date.now());
    
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
          
    for(var _k = 0; _k < _objects.length; _k++)
    {
      if(_objects[_k].visible){
        if(!_objects[_k].paused)
          _objects[_k].animate.call(_objects[_k], _tickTimeDiff);
        _objects[_k].draw.call(_objects[_k], _context);
      }
    }
    
    _fps = Math.round(1000 / _tickTimeDiff);
    _switchObject.showInfo.call(this);
    
    _ticking = false;
    
    while(_removeObjects.length > 0){
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
  
  var _validateObject = function(object) {
    if(object.draw && object.animate && object.visible != undefined && object.paused != undefined)
      return true;
    else
      throw new Error('Objects must have the public methods draw & animate and the public attributes visible and paused.');
  };
  
  /**
   * Draws the information string on the canvas if showInfo is true
   */
  var _drawInfo = function() {
    _context.save();
    _context.font = _infoFont;
    _context.fillStyle = '#009999';
    _context.fillText(_objects.length + ' Objects ' + _fps + ' FPS', 5, 10);
    _context.restore();
  }; 
}