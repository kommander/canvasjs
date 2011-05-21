/**
 * A moving starfield (well it could be snow also...)
 * an Object for Loop.js 
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.obj.Stars = function(width, height, maxStars, speed, color, min, max, timeout, useLines, lineScale){
    
  var _maxStars = maxStars || 0,
  _stars = [],
  _timeSecond = 0,
  _starSize = [],
  _lineLength = 0,
  _color = color || '#eee',
  _PI2 = Math.PI * 2;
  
  /**
   * Generates the star objects depending on the settings,
   * is used to regenerate stars if a settings is changed
   * or if stars are added.
   */
  _createStars = (function(from) {
    //generate stars
    for(var i = (from || 0); i < _maxStars; i++){
      var size = kk.rand(_starSize[0], _starSize[1]);
      _stars[i] = {
        color: (_color.constructor == Array) ? _color[kk.rand(0, _color.length)] : _color,
        size: size,
        x: kk.rand(0, this.width),
        y: kk.rand(-((this.useLines) ? this.lineScale * this.speed * size: size), this.height + 1000),
        timeout: (size < 0) ? kk.rand(0, this.timeout) : 0
      };
    }
  }).bind(this);
  
  //The time after which the stars appear again
  this.timeout = timeout || 10000;
  
  //Width and height of the starfield
  this.width = width || 500;
  this.height = height || 1000;
  
  //If lines are used, the line length is determined by the speed and the star size,
  //multiplied by the lineScale
  this.useLines = useLines || false;
  this.lineScale = lineScale || 0.1;
  
  this.x = 0;
  this.y = 0;
  
  //How fast are the stars moving in pixel per second
  //The stars own speed is the general speed times their size
  this.speed = speed || 10;
  this.color = function(color){
    _color = color;
    for(var i = 0; i < _maxStars; i++){
      _stars[i].color = (_color.constructor == Array) ? _color[kk.rand(0, _color.length)] : _color;
    }
  };
  
  /**
   * Set the minimum and maximum size of the stars,
   * they get created randomly
   */
  this.starSize = function(min, max) {
    _starSize[0] = ((parseInt(min) || _starSize[0]) || 1);
    _starSize[1] = ((parseInt(max) || _starSize[1]) || 4);
    if(_starSize[0] > _starSize[1]){
      throw Error('min must be <= max!');
    }
    _createStars();
    return this;
  };
  
  this.starSize(min || 1, max || 4);
  
  /**
   * Changes the maximum stars that move over the screen,
   * if needed generates or removes them
   */
  this.maxStars = function(max){
    if(max > _maxStars){
      _maxStars = max;
      _createStars(_stars.length - 1);
    } 
    else if(max) {
      _maxStars = max;
      _stars.slice(max);
    }
    return _maxStars;
  };
  
  /**
   * Render the stars
   */
  this.tick = function(context, timeDiff){
    _timeSecond = timeDiff * 0.001;
    context.save()
    context.translate(this.x, this.y);
    for(var i = 0; i < _maxStars; i++){
      if(_stars[i].x + this.x <  -_stars[i].size || _stars[i].x + this.x > this.width + _stars[i].size)
        continue;
      context.fillStyle = _stars[i].color;
      context.strokeStyle = _stars[i].color;
      _lineLength = (this.useLines) ? this.lineScale * this.speed * _stars[i].size: _stars[i].size;
      _stars[i].timeout -= timeDiff;
      if((this.speed > 0 && _stars[i].y > this.height + _lineLength)
        || (this.speed < 0 && _stars[i].y < _lineLength)){
        _stars[i].y = this.speed > 0 ? -_lineLength : this.height + _lineLength;
        _stars[i].x = kk.rand(_stars[i].size, this.width - _stars[i].size);
        _stars[i].timeout = kk.rand(0, this.timeout);
      }
      else if(_stars[i].timeout <= 0){
        _stars[i].y += _timeSecond * this.speed * _stars[i].size;
        context.beginPath();
        if(this.useLines){
          context.lineWidth = _stars[i].size;
          context.moveTo(_stars[i].x, _stars[i].y - _lineLength);
          context.lineTo(_stars[i].x, _stars[i].y);
          context.stroke();
        } else {
          context.arc(_stars[i].x, _stars[i].y, _stars[i].size * 0.5, 0, _PI2, false);
          context.fill();
        }
        context.closePath();
      }
    }
    context.restore();
  };
};