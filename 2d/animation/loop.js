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
  
  _tickTime = Date.now(),
  _tickDuration = 0,
  
  _startTime = 0,
  _statusTime = Date.now(),
  _frameRate = 30,
  
  //Stats
  _droppedFrames = 0,
  _renderedFrames = 0,
  _frameCounter = 0,
  _fps = 0,
  _originalFont = _context.font,
  _infoFont = '800 12px Helvetica, Arial, sans-serif';
  _tickInterval = null,
  
  //The objects to render
  _objects = [];
  
  this.showInfo = true;
  
  /**
   * Add an Object to the render loop.
   * An Object has to provide at least a publich "draw" method,
   * which will be provided with the 2D context,
   * otherwise it won't be added.
   */
  this.add = function(object){
    if(object.draw)
      _objects.push(object);
  };
  
  /**
   * The main loop, here the objects are rendered if visible
   */
  var _tick = function(){
    if(!_running)
      return;
    
    _tickTime = Date.now();
    
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
          
    for(var k = 0; k < _objects.length; k++)
    {
      if(_objects[k].visible !== false)
      {
        if(_objects[k]['animate'] != undefined)
          _objects[k].animate();
        if(_objects[k]['draw'] != undefined)
          _objects[k].draw(_context);
      }
    }
    
    if(this.showInfo)
    {
      if(_tickTime - _statusTime >= 1000){
        _fps = Math.floor(_frameCounter / (_tickTime - _statusTime) * 1000);
        _renderedFrames += _frameCounter;
        _frameCounter = 0;
        _statusTime = _tickTime;
      }
      _drawInfo();
    }
    
    _frameCounter++;
    
    _tickInterval = setTimeout(function(c, t){ t.call(c); }, 1000 /  _frameRate - (Date.now() - _tickTime), this, _tick);
  };
  
  /**
   * start the loop
   */ 
  this.start = function() {
    _startTime = Date.now();
    _frameCounter = 0;
    _running = true;
    _tickInterval = setTimeout(function(c, t){ t.call(c); }, Math.floor(1000 / _frameRate), this, _tick);
  };
  
  /**
   * stop the loop
   */
  this.stop = function() {
    _running = false;
    clearInterval(_tickInterval);
    _tickInterval = null;
  };
  
  /**
   * set the max desired framerate for the loop
   */
  this.frameRate = function(fps) {
    _frameRate = fps;
    if(_running){
      this.stop();
      this.start();
    }
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