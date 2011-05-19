/**
 * The Game
 */
var SnakeGame = function(canvas, tileSize) {
  
  var _loop = new Loop(canvas.getContext('2d')),
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
        context.arc(this.x, this.y, _size, 0, Math.PI / 2 * 360, false);
        context.fill();
        context.closePath();
        context.restore();
      };
    }
  ],
  _onlineCrunchies = [],
  _crunchyInterval = 0x0,
  _points = 0,
  _flashMessages = [],
  _flashMessageTime = 1000,
  _drawTextArgs = null;
  
  this.visible = true;
  this.paused = false;
  
  /**
   * Add a flash message for rendering
   */
  var _flashMessage = function(msg, color){
    _flashMessages.push({
      msg: msg,
      color: color,
      time: 0
    });
  };
  
  /**
   * Checks for canvas boundaries, crunchy hits and flash messages
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
          _flashMessage(_onlineCrunchies[i].points(_snake), '#fff');
          _onlineCrunchies.splice(i, 1);
          break;
        }
      }
    };
    
    _drawText(
      context,
      'Points: ' + _points,
      5,
      20,
      '800 20px Comic Sans, Tahoma',
      '#fff',
      'left',
      1,
      'rgba(30, 30, 30, 0.7)',
      2
    );
    
    //Pause Message
    if(_paused){
      _drawText(
        context,
        'PAUSED',
        context.canvas.width / 2,
        context.canvas.width / 2,
        '800 50px Comic Sans, Tahoma',
        '#1B7FF2',
        'center',
        1,
        'rgba(255, 255, 255, 0.8)',
        5
      );
    }
    
    //Pause Message
    if(!_running){
      _drawText(
        context,
        'PRESS SPACE\nTO START A NEW GAME',
        context.canvas.width / 2,
        context.canvas.width / 2,
        '800 20px Comic Sans, Tahoma',
        '#1B7FF2',
        'center',
        1,
        'rgba(255, 255, 255, 0.8)',
        5
      );
    }
    
    //Draw flash messages
    for(var i = 0; i < _flashMessages.length; i++){
      _flashMessages[i].time += tickTimeDiff;
      if(_flashMessages[i].time >= _flashMessageTime){
        _flashMessages.splice(i, 1);
        continue;
      }
      _drawText(
        context,
        _flashMessages[i].msg,
        context.canvas.width / 2,
        context.canvas.width / 2 - _flashMessages[i].time * 0.15,
        '800 50px Comic Sans, Tahoma',
        _flashMessages[i].color,
        'center',
        1.5 - _flashMessages[i].time * 0.0015,
        'rgba(200, 200, 200, ' + context.globalAlpha + ')',
        10
      );
    }
  };
  
  /**
   * Draw some text to the canvas
   * Arguments [context, msg, x, y, font, fillStyle, textAlign, alpha, shadowColor, shadowBlur]
   */
  var _drawText = function(){
    _drawTextArgs = arguments;
    _drawTextArgs[0].save();
    _drawTextArgs[0].globalAlpha = _drawTextArgs[7];
    _drawTextArgs[0].fillStyle = _drawTextArgs[5];
    _drawTextArgs[0].shadowColor = _drawTextArgs[8];
    _drawTextArgs[0].shadowBlur = _drawTextArgs[9];
    _drawTextArgs[0].font = _drawTextArgs[4];
    _drawTextArgs[0].translate(_drawTextArgs[2], _drawTextArgs[3]);
    _drawTextArgs[0].textAlign = _drawTextArgs[6];
    _drawTextArgs[0].fillText(_drawTextArgs[1], 0, 0);
    _drawTextArgs[0].restore();
  }
  
  /**
   * Randomly adds new crunchies 
   */
  var _crunchy = function(){
    var newCrunchy = new _crunchies[0](_randRange(0, canvas.width), _randRange(0, canvas.height));
    _onlineCrunchies.push(newCrunchy);
    _loop.addBefore(newCrunchy, _snake);
  };
  
  /**
   * The callback for the Snake object when it collided
   */
  var _snakeCollided = function(){
    _flashMessage('CRASH!', '#FF4400');
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
  var _snake = new Snake(100, 200, 100, 2, 10, 75, _snakeCollided);
  
  //Add the game itself to the loop for game logic ticks
  _loop
    .push(_background)
    .push(_snake)
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
  var _keyHandler = function(evt) {
    switch(evt.keyCode) {
      // I
      case 73:
        _showInfo = !_showInfo;
        _loop.showInfo(_showInfo);
        break;
      // L
      case 76:
        _snake.dashed(!_snake.dashed());
        break;
      // A, left
      case 37:
      case 65:
        _snake.move(2);
        break;
      // w, up
      case 38:
      case 87:
        _snake.move(0);
        break;
      // S, down
      case 40:
      case 83:
        _snake.move(1);
        break;
      // D, right
      case 39:
      case 68:
        _snake.move(3);
        break;
      // SPACE
      case 32:
        if(!_running && !_paused)
          _restart();
        break;
      // P
      case 80:
        if(_running){
          if(_paused)
            _this.resume();
          else
            _this.pause();
        }
        break;
    }
    evt.stopPropagation();
    evt.preventDefault();
  };
  
  /**
   * Get a random number between a min and a max number
   */
  var _randRange = function(minNum, maxNum) 
  {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
  }
    
  //Keylistener
  window.addEventListener('keydown', _keyHandler, false);
  
};

/**
 * The Snake itself
 */
var Snake = function(x, y, length, direction, thickness, speed, collisionCallback){
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
  _dashed = false;
  
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
        if(n1.y != n2.y || !((n0.x > n1.x && n0.x < n2.x) || (n0.x < n1.x && n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //bottom
      case 1:
        if(n1.y != n2.y || !((n0.x > n1.x && n0.x < n2.x) || (n0.x < n1.x && n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //left
      case 2:
        if(n1.x != n2.x || !((n0.y > n1.y && n0.y < n2.y) || (n0.y < n1.y && n0.y > n2.y)))
          break;
        if(Math.abs(n0.x - n1.x) < _movedDistance)
          _collided.call(this);
        break;
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
      
    //remove rest directions
    switch(_nodes[_nodeIndex].d){
      //top
      case 0:
        context.lineTo(_nodes[_nodeIndex].x, _nodes[_nodeIndex].y + _rest);
        _checkCollision.call(this, _nodes[0], _nodes[_nodeIndex], {x: _nodes[_nodeIndex].x, y: _nodes[_nodeIndex].y + _rest});
        break;
      //bottom
      case 1:
        context.lineTo(_nodes[_nodeIndex].x, _nodes[_nodeIndex].y - _rest);
        _checkCollision.call(this, _nodes[0], _nodes[_nodeIndex], {x: _nodes[_nodeIndex].x, y: _nodes[_nodeIndex].y - _rest});
        break;
      //left
      case 2:
        context.lineTo(_nodes[_nodeIndex].x + _rest, _nodes[_nodeIndex].y);
        _checkCollision.call(this, _nodes[0], _nodes[_nodeIndex], {x: _nodes[_nodeIndex].x + _rest, y: _nodes[_nodeIndex].y});
        break;
      //right
      case 3:
        context.lineTo(_nodes[_nodeIndex].x - _rest, _nodes[_nodeIndex].y);
        _checkCollision.call(this, _nodes[0], _nodes[_nodeIndex], {x: _nodes[_nodeIndex].x - _rest, y: _nodes[_nodeIndex].y});
        break;
    }
    
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
    