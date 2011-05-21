/**
 * The Game
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.snake = {};
kk.g2d.snake.SnakeGame = function(canvas, tileSize) {
  
  var _loop = new kk.Loop(canvas.getContext('2d')),
  _running = false,
  _points = 0,
  _paused = false,
  _this = this,
  _showInfo = false,
  //The crunchies that can be eaten by the snake, extendable
  _crunchies = [
    function(x, y){
      this.x = x;
      this.y = y;
      this.name = 'Kommander Crunch!';
      
      var _size = 12,
      _blur = 10,
      _wobbleSwitch = true;
      
      this.points = function(snake){
        return Math.round(snake.speed() * 0.3);
      };
      
      this.action = function(snake){
        snake.length(snake.length() + 50);
        snake.speed(snake.speed() + 1);
      };
      
      this.tick = function(context, tickTimeDiff){
        //animate
        if(_wobbleSwitch){
          _size -= 0.1;
          _blur -= 0.1;
          if(_size <= 8)
            _wobbleSwitch = false;
        } else {
          _size += 0.1;
          _blur += 0.1;
          if(_size >= 10)
            _wobbleSwitch = true;
        }
        
        //Draw
        context.save();
        context.beginPath();
        context.fillStyle = '#1B7FF2';
        context.shadowColor = 'rgba(230, 230, 230, 0.7)';
        context.shadowBlur = _blur;
        context.arc(this.x, this.y, _size, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
        context.restore();
      };
    }
  ],
  _onlineCrunchies = [],
  _crunchyInterval = 0x0,
  _points = 0;
  
  this.visible = true;
  this.paused = false;
  
  /**
   * Checks for canvas boundaries, crunchy hits
   * Draws the points
   */
  this.tick = function(context, tickTimeDiff){
    if(!_snake.paused){
      if(_snake.pos().x < 0 || _snake.pos().x > canvas.width || _snake.pos().y < 0 || _snake.pos().y > canvas.height)
        _snakeCollided();
      
      //Check Crunchies (_onlineCrunchies)
      for(var i = 0; i < _onlineCrunchies.length; i++){
        if(Math.sqrt(Math.pow(_onlineCrunchies[i].y - _snake.pos().y, 2) + Math.pow(_onlineCrunchies[i].x - _snake.pos().x, 2)) < _snake.thickness() + 4){
          _onlineCrunchies[i].action(_snake);
          _points += _onlineCrunchies[i].points(_snake);
          _loop.remove(_onlineCrunchies[i]);
          _flash.msg(_onlineCrunchies[i].points(_snake), { color: '#fff' });
          _onlineCrunchies.splice(i, 1);
          break;
        }
      }
    };
    
    context.save();
    context.fillStyle = '#fff';
    context.shadowColor = 'rgba(30, 30, 30, 0.7)';
    context.shadowBlur = 2;
    context.font = '800 20px Comic Sans, Tahoma';
    context.translate(5, 20);
    context.textAlign = 'left';
    context.fillText('Points: ' + _points, 0, 0);
    context.restore();
    
    //Pause Message
    if(_paused){
      context.save();
      context.fillStyle = '#1B7FF2';
      context.shadowColor = 'rgba(255, 255, 255, 0.8)';
      context.shadowBlur = 5;
      context.font = '800 40px Comic Sans, Tahoma';
      context.translate(context.canvas.width / 2, context.canvas.height / 2);
      context.textAlign = 'center';
      context.fillText('PAUSED', 0, 0);
      context.restore();
    }
    
    //Pause Message
    if(!_running){
      context.save();
      context.fillStyle = '#1B7FF2';
      context.shadowColor = 'rgba(255, 255, 255, 0.8)';
      context.shadowBlur = 5;
      context.font = '800 20px Comic Sans, Tahoma';
      context.translate(context.canvas.width / 2, context.canvas.height / 2);
      context.textAlign = 'center';
      context.fillText('PRESS SPACE\nTO START A NEW GAME', 0, 0);
      context.restore();
    }    
  };
  
  /**
   * Randomly adds new crunchies 
   */
  var _crunchy = function(){
    var newCrunchy = new _crunchies[0](kk.rand(0, canvas.width), kk.rand(0, canvas.height));
    _onlineCrunchies.push(newCrunchy);
    _loop.addBefore(newCrunchy, _snake);
  };
  
  /**
   * The callback for the Snake object when it collided
   */
  var _snakeCollided = function(){
    _flash.msg('CRASH!', { color: '#FF4400' });
    clearInterval(_crunchyInterval);
    _snake.paused = true;
    _running = false;
  };
  
  /**
   * Background
   */
  var _background = new (function(context){
    context.save();
    var gradient = context.createRadialGradient(context.canvas.width / 2, context.canvas.height / 2, 0, context.canvas.width / 2, context.canvas.height / 2, context.canvas.width);
    gradient.addColorStop(0, '#EFEFEF');
    gradient.addColorStop(1, '#666');
    context.fillStyle = gradient;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    var _data = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
    
    this.tick = function(context){
      context.putImageData(_data, 0, 0);
    };
  })(canvas.getContext('2d'));
  
  //Create the snake and add it
  var _snake = new kk.g2d.snake.Snake(100, 200, 100, 2, 10, 75, _snakeCollided);
  
  //Create a FlashText instance to show gathered points animated
  var _flash = new kk.g2d.obj.FlashText({ x: canvas.width / 2, y: canvas.height / 2, font: '800 40px Comic Sans, Tahoma' });
  
  //Add the game itself to the loop for game logic ticks
  _loop
    .push(_background)
    .push(_snake)
    .push(_flash)
    .push(this)
    .frameRate(60);
  
  /**
   * Starts the game
   */
  this.start = function(){
    _snake.paused = true;
    _loop.start();
  };
  
  /**
   * Restart the game
   */
  var _restart = function(){
    _running = true;
    _points = 0;
    
    _snake.reset(100, 200, 100, 2, 10, 75);
    _snake.paused = false;
    
    //Remove crunchies
    for(var i = 0; i < _onlineCrunchies.length; i++)
      _loop.remove(_onlineCrunchies[i]);
    _onlineCrunchies = [];
    _crunchyInterval = setInterval(_crunchy, 3000);
  };
  
  /**
   * Stops the game
   */
  this.stop = function(){
    clearInterval(_crunchyInterval);
    _loop.stop();
  };
  
  /**
   * Pauses the game
   */
  this.pause = function(){
    clearInterval(_crunchyInterval);
    _paused = true;
    _snake.paused = true;
  };
  
  /**
   * Resumes the game
   */
  this.resume = function(){
    _crunchyInterval = setInterval(_crunchy, 3000);
    _paused = false;
    _snake.paused = false;
  };
  
  /**
   * Key control input handling
   */
  kk.Input.bind('i', 'info', function(){
    _showInfo = !_showInfo;
    _loop.showInfo(_showInfo);
  })
  .bind('l', 'linestyle', function(){
    _snake.dashed(!_snake.dashed());
  })
  .bind(['a', 'left'], 'left', function(){ _snake.move(2); })
  .bind(['w', 'up'], 'up', function(){ _snake.move(0); })
  .bind(['s', 'down'], 'down', function(){ _snake.move(1); })
  .bind(['d', 'right'], 'right', function(){ _snake.move(3); })
  .bind('space', 'start', function(){
    if(!_running && !_paused)
      _restart();
  })
  .bind('p', 'pause', function(){
    if(_running){
      if(_paused)
        _this.resume();
      else
        _this.pause();
    }
  });
};

/**
 * The Snake itself
 */
kk.g2d.snake.Snake = function(x, y, length, direction, thickness, speed, collisionCallback){
  var _nodes = [],
  _nodeIndex = 1,  
  _length = 0,
  _drawn = 0,
  _rest = 0,
  _currentDirection = -1,
  _speed = 0,
  _movedDistance = 0,
  _thickness = 0,
  _halfThickness = 0,
  _collisionCallback = collisionCallback,
  _dashed = false,
  _tail = {};
  
  /**
   * Flip the dashed linesstyle on and off
   */
  this.dashed = function(dashed){
    if(dashed != undefined)
      _dashed = dashed;
    return _dashed;
  };
  
  /**
   * Resets the snakes position, length, direction, thickness and speed
   */
  this.reset = function(_x, _y, length, direction, thickness, speed){
    _nodes = [{ d: direction, x: x, y: y }];
    _length = length;
    _currentDirection = direction;
    _thickness = thickness;
    _halfThickness = thickness / 2;
    _speed = speed;
  };
  
  /**
   * Get/Set the length of the snake
   */
  this.length = function(length){
    if(length)
      _length = length;
    return _length;
  };
  
  /**
   * Get/Set the speed of the snake
   */
  this.speed = function(speed){
    if(speed)
      _speed = speed;
    return _speed;
  };
  
  /**
   * Get the thickness
   */
  this.thickness = function(){
    return _thickness;
  }
  
  /**
   * Get the current position
   */
  this.pos = function(){
    return _nodes[0];
  };
  
  this.paused = false;
  
  /**
   * Checks if n0 collides with the line between n1 and n2
   */
  var _checkCollision = function(n0, n1, n2) {
    if(this.paused)
      return;
    switch(_currentDirection){
      //top
      case 0:
      //bottom
      case 1:
        if(n1.y != n2.y || !((n0.x > n1.x && n0.x < n2.x) || (n0.x < n1.x && n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //left
      case 2:
      //right
      case 3:
        if(n1.x != n2.x || !((n0.y > n1.y && n0.y < n2.y) || (n0.y < n1.y && n0.y > n2.y)))
          break;
        if(Math.abs(n0.x - n1.x) < _movedDistance)
          _collided.call(this);
        break;
    }
  };
  
  var _collided = function(){
    _collisionCallback();
  };
  
  this.tick = function(context, tickTimeDiff) {
    if(!this.paused){
      _movedDistance = tickTimeDiff / 1000 * _speed; 
      switch(_currentDirection){
        //top
        case 0:
          _nodes[0].y -= _movedDistance;
          break;
        //bottom
        case 1:
          _nodes[0].y += _movedDistance;
          break;
        //left
        case 2:
          _nodes[0].x -= _movedDistance;
          break;
        //right
        case 3:
          _nodes[0].x += _movedDistance;
          break;
      }
      
    }
    
    _rest = _length;
    _nodeIndex = 0;
    
    context.save();
    context.beginPath();
    context.dashed = _dashed;
    context.dashPattern = [12, 8];
    context.strokeStyle = '#222';
    context.lineWidth = _thickness;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.moveTo(_nodes[_nodeIndex].x, _nodes[_nodeIndex].y);
    
    while(_nodeIndex < _nodes.length - 1){
      _nodeIndex++;
      _drawn = (_nodes[_nodeIndex].y - _nodes[_nodeIndex - 1].y) + (_nodes[_nodeIndex].x - _nodes[_nodeIndex - 1].x);
      
      //Collide
      if(_nodeIndex + 1 < _nodes.length){
        _checkCollision.call(this, _nodes[0], _nodes[_nodeIndex], _nodes[_nodeIndex + 1]);
      }
      
      if(_rest - Math.abs(_drawn) > 0){
        context.lineTo(_nodes[_nodeIndex].x, _nodes[_nodeIndex].y);
        _rest -= Math.abs(_drawn);
      } else {
        _nodes.splice(_nodeIndex);
        _nodeIndex--;
      }
    }
    
    //Tail
    _tail.x = (_nodes[_nodeIndex].d == 0 || _nodes[_nodeIndex].d == 1) ? _nodes[_nodeIndex].x : (_nodes[_nodeIndex].d == 2) ? _nodes[_nodeIndex].x + _rest : _nodes[_nodeIndex].x - _rest;
    _tail.y = (_nodes[_nodeIndex].d == 2 || _nodes[_nodeIndex].d == 3) ? _nodes[_nodeIndex].y : (_nodes[_nodeIndex].d == 1) ? _nodes[_nodeIndex].y - _rest : _nodes[_nodeIndex].y + _rest;
    context.lineTo(_tail.x, _tail.y);
    _checkCollision.call(this, _nodes[0], _nodes[_nodeIndex], _tail);
    
    context.stroke();
    context.closePath();
    context.restore();
  };
  
  this.move = function(direction){
    if(this.paused || (_currentDirection == 0 && direction == 1) || (_currentDirection == 1 && direction == 0)
      || (_currentDirection == 2 && direction == 3) || (_currentDirection == 3 && direction == 2))
      return;
    _nodes.splice(1, 0, { d: _currentDirection, x: _nodes[0].x, y: _nodes[0].y});
    _currentDirection = _nodes[0].d = direction;
  };
  
  this.reset(x, y, length, direction, thickness, speed);
};
    