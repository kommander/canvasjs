/**
 * The Game
 */
var SnakeGame = function(canvas, tileSize) {
  
  var _loop = new Loop(canvas),
  _points = 0,
  _paused = false,
  _this = this,
  //The crunchies that can be eaten by the snake, extendable
  _crunchies = [
    function(x, y){
      this.x = x;
      this.y = y;
      this.name = 'Kommander Crunch!';
      
      this.paused = false;
      this.visible = true;
      
      this.points = function(snake){
        return Math.round(snake.speed() * 0.3);
      };
      
      this.action = function(snake){
        snake.length(snake.length() + 50);
        snake.speed(snake.speed() + 1);
      };
      
      this.animate = function(){};
      
      this.draw = function(context){
        context.save();
        context.beginPath();
        context.fillStyle = '#1B7FF2';
        context.shadowColor = 'rgba(230, 230, 230, 0.7)';
        context.shadowBlur = 2;
        context.arc(this.x, this.y, 8, 0, Math.PI / 2 * 360, false);
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
  _flashMessageTime = 1000;
  
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
   */
  this.animate = function(tickTimeDiff){
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
    
    //Animate flash messages
    for(var i = 0; i < _flashMessages.length; i++){
      _flashMessages[i].time += tickTimeDiff;
      if(_flashMessages[i].time >= _flashMessageTime){
        _flashMessages.splice(i, 1);
      }
    }
  };
  
  /**
   * Draws the points
   */
  this.draw = function(context){
    context.save();
    context.fillStyle = '#fff';
    context.shadowColor = 'rgba(30, 30, 30, 0.7)';
    context.shadowBlur = 3;
    context.font = '800 20px Comic Sans, Tahoma';
    context.fillText('Points: ' + _points, 5, 20);
    context.restore();
    
    //Draw flash messages
    for(var i = 0; i < _flashMessages.length; i++){
      context.save();
      context.globalAlpha = 1.5 - _flashMessages[i].time * 0.0015;
      context.fillStyle = _flashMessages[i].color;
      context.shadowColor = 'rgba(200, 200, 200, ' + context.globalAlpha + ')';
      context.shadowBlur = 10;
      context.font = '800 50px Comic Sans, Tahoma';
      context.translate(context.canvas.width / 2, context.canvas.width / 2 - _flashMessages[i].time * 0.15);
      context.textAlign = 'center';
      context.fillText(_flashMessages[i].msg, 0, 0);
      context.restore();
    }
  };
  
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
    
    this.visible = true;
    this.paused = false;
    this.animate = function(){};
    this.draw = function(context){
      context.putImageData(_data, 0, 0);
    };
  })(canvas.getContext('2d'));
  
  //Create the snake and add it
  var _snake = new Snake(100, 200, 100, 2, 10, 75, _snakeCollided);
  
  //Add the game itself to the loop for game logic ticks
  _loop.add(_background)
    .add(_snake)
    .add(this)
    .frameRate(60)
    .showInfo(true);
  
  /**
   * Starts the game
   */
  this.start = function(){
    _points = 0;
    _snake.reset(100, 200, 100, 2, 10, 75);
    _snake.paused = false;
    //Remove crunchies
    for(var i = 0; i < _onlineCrunchies.length; i++)
      _loop.remove(_onlineCrunchies[i]);
    _onlineCrunchies = [];
    _crunchyInterval = setInterval(_crunchy, 3000);
    _loop.start();
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
      // L
      case 76:
        _snake.dashed(!_snake.dashed());
        break;
      // A
      case 65:
        _snake.move(2);
        break;
      // w
      case 87:
        _snake.move(0);
        break;
      // S
      case 83:
        _snake.move(1);
        break;
      // D
      case 68:
        _snake.move(3);
        break;
      // SPACE
      case 32:

        break;
      // ESC
      case 27:
        _this.stop();
        _this.start();
        break;
      // P
      case 80:
        if(_paused)
          _this.resume();
        else
          _this.pause();
        break;
    };
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
  
  //Loop object attributes
  this.visible = true;
  this.paused = false;
  
  /**
   * Moves the snake forward and checks for collisions
   */
  this.animate = function(tickTimeDiff){
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
    //Collide
    for(var i = 2; i < _nodes.length; i++){
      if(i + 1 < _nodes.length){
        _checkCollision.call(this, _nodes[0], _nodes[i], _nodes[i + 1]);
      }
    }
  };
  
  /**
   * Checks if n0 collides with the line between n1 and n2
   */
  var _checkCollision = function(n0, n1, n2) {
    if(this.paused)
      return;
    switch(_currentDirection){
      //top
      case 0:
        if(n1.y != n2.y || !((n0.x > n1.x &&n0.x < n2.x) || (n0.x < n1.x && n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //bottom
      case 1:
        if(n1.y != n2.y || !((n0.x > n1.x &&n0.x < n2.x) || (n0.x < n1.x && n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //left
      case 2:
        if(n1.x != n2.x || !((n0.y > n1.y &&n0.y < n2.y) || (n0.y < n1.y && n0.y > n2.y)))
          break;
        if(Math.abs(n0.x - n1.x) < _movedDistance)
          _collided.call(this);
        break;
      //right
      case 3:
        if(n1.x != n2.x || !((n0.y > n1.y &&n0.y < n2.y) || (n0.y < n1.y && n0.y > n2.y)))
          break;
        if(Math.abs(n0.x - n1.x) < _movedDistance)
          _collided.call(this);
        break;
    }
  };
  
  var _collided = function(){
    _collisionCallback();
  };
  
  this.draw = function(context) {
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
    