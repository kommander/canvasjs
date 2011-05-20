/**
 * A moving starfield (well it could be snow also...)
 * an Object for Loop.js 
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.obj.Stars = function(maxStars, speed){
    
  var _maxStars = maxStars,
  _stars = [],
  _speed = speed,
  _timeSecond = 0;
  
  //generate stars
  for(var i = 0; i < _maxStars; i++){
    _stars.push({
      x: kk.rand(0, 500),
      y: kk.rand(0, 2000),
      size: kk.rand(1, 4),
      timeout: 0
    });
  }
  
  this.tick = function(context, timeDiff){
    _timeSecond = timeDiff / 1000;
    for(var i = 0; i < _maxStars; i++){
      _stars[i].timeout -= timeDiff;
      if(_stars[i].y > context.canvas.height + _stars[i].size){
        _stars[i].y = -10;
        _stars[i].x = kk.rand(10, context.canvas.width - 10);
        _stars[i].timeout = kk.rand(0, 10000);
      }
      if(_stars[i].timeout <= 0){
        _stars[i].y += _timeSecond * _speed * _stars[i].size;
        context.beginPath();
        context.fillStyle = '#eee';
        context.arc(_stars[i].x, _stars[i].y, _stars[i].size / 2, 0, Math.PI / 2 * 360, false);
        context.fill();
        context.closePath();
      }
    }
  };
};