/**
 * Loop.js
 * A simple animation loop for HTML5 canvas
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 */
function Loop(canvas)
{
  var _canvas = canvas,
  _context = _canvas.getContext('2d'),
  _running = false,
  _ticking = false,
  
  _tickTime = Date.now(),
  _tickDuration = 0,
  
  _startTime = 0,
  _statusTime = Date.now(),
  _frameRate = 30,
  _frameRateTick = 1000 / _frameRate,
  
  //Stats
  _droppedFrames = 0,
  _renderedFrames = 0,
  _frameCounter = 0,
  _fps = 0,
  _originalFont = _context.font,
  _infoFont = '800 12px Helvetica, Arial, sans-serif';
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
  };
  
  /**
   * Add an Object to the render loop.
   * An Object has to provide at least a publich "draw" method,
   * which will be provided with the 2D context,
   * otherwise it won't be added.
   */
  this.add = function(object){
    if(_validateObject(object))
      return _objects.push(object);
  };
  
  /**
   * Add a new object _before_ an existing one
   */
  this.addBefore = function(object, before){
    if(_validateObject(object) && _objects.indexOf(before) != -1)
      _objects.splice(_objects.indexOf(before) - 1, 0, object);
  };
  
  /**
   * Add a new object _after_ an existing one
   */
  this.addAfter = function(object, after){
    if(_validateObject(object) && _objects.indexOf(after) != -1)
      _objects.splice(_objects.indexOf(after), 0, object);
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
    if(!_running)
      return;
    
    _ticking = true;
    _tickTime = Date.now();
    
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
          
    for(var k = 0; k < _objects.length; k++)
    {
      if(_objects[k].animate)
        _objects[k].animate();
      _objects[k].draw(_context);
    }
    
    if(_tickTime - _statusTime >= 1000){
      _fps = Math.floor(_frameCounter / (_tickTime - _statusTime) * 1000);
      _renderedFrames += _frameCounter;
      _frameCounter = 0;
      _statusTime = _tickTime;
    }
      
    _switchObject.showInfo.call(this);
    
    _frameCounter++;
    
    _ticking = false;
    
    while(_removeObjects.length > 0){
      _remove(_removeObjects.shift());
    }
    
    _tickDuration = (Date.now() - _tickTime);
    setTimeout(_tick, _frameRateTick - _tickDuration);
  };
  
  /**
   * start the loop
   */ 
  this.start = function() {
    _startTime = Date.now();
    _frameCounter = 0;
    _running = true;
    setTimeout(_tick, 1);
  };
  
  /**
   * stop the loop
   */
  this.stop = function() {
    _running = false;
  };
  
  /**
   * set the max desired framerate for the loop
   */
  this.frameRate = function(fps) {
    _frameRate = fps;
    _frameRateTick = 1000 / _frameRate;
    if(_running){
      this.stop();
      this.start();
    }
  };
  
  /** 
   * Access the current FPS
   */
  this.fps = function(){
    return _fps;
  };
  
  var _validateObject = function(object) {
    return (object.draw);
  };
  
  /**
   * Draws the information string on the canvas if showInfo is true
   */
  var _drawInfo = function() {
    _originalFont = _context.font
    _context.font = _infoFont;
    _context.fillStyle = '#009999';
    var runtime = Date.now() - _startTime;
    var infoString = _objects.length + ' Objects ';
    infoString += Math.floor(runtime / 60000) + 'min. ' + Math.floor(runtime % 60000 / 1000) + ' sec. ';
    infoString += _fps + ' FPS';
    var metrics = _context.measureText(infoString);
    _context.fillText(infoString, _canvas.width - metrics.width - 5, 10);
    _context.font = _originalFont;
  }; 
}