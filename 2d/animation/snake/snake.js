/**
 * The Game
 */
var SnakeGame = function(canvas, tileSize) {
  
  var _loop = new Loop(canvas),
  _points = 0,
  _paused = false,
  _this = this,
  _crunchies = [
    function(x, y){
      this.x = x;
      this.y = y;
      this.name = 'Kommander Crunch!';
      
      this.paused = false;
      this.visible = true;
      
      this.points = 25;
      
      this.action = function(snake){
        snake.length(snake.length() + 50);
        snake.speed(snake.speed() + 1);
      };
      
      this.animate = function(){};
      
      this.draw = function(context){
        context.beginPath();
        context.fillStyle = '#9f9f9f';
        context.arc(this.x, this.y, 8, 0, Math.PI / 2 * 360, false);
        context.fill();
        context.closePath();
      };
    }
  ],
  _onlineCrunchies = [],
  _crunchyInterval = 0x0,
  _points = 0;
  
  this.visible = true;
  this.paused = false;
  
  this.animate = function(tickTimeDiff){
    if(_snake.pos().x < 0 || _snake.pos().x > canvas.width || _snake.pos().y < 0 || _snake.pos().y > canvas.height)
      _snakeCollided();
    
    //Check Crunchies (_onlineCrunchies)
    for(var i = 0; i < _onlineCrunchies.length; i++){
      if(Math.sqrt(Math.pow(_onlineCrunchies[i].y - _snake.pos().y, 2) + Math.pow(_onlineCrunchies[i].x - _snake.pos().x, 2)) < _snake.thickness() + 4){
        _onlineCrunchies[i].action(_snake);
        _points += _onlineCrunchies[i].points;
        _loop.remove(_onlineCrunchies[i]);
        _onlineCrunchies.splice(i, 1);
        break;
      }
    }
  };
  
  this.draw = function(context){
    context.save();
    context.fillStyle = '#4B8A08';
    context.font = '800 12px Helvetica, Arial, sans-serif';
    context.fillText('Points: ' + _points, 5, 10);
    context.restore();
  };
  
  var _crunchy = function(){
    var newCrunchy = new _crunchies[0](_randRange(0, canvas.width), _randRange(0, canvas.height));
    _onlineCrunchies.push(newCrunchy);
    _loop.addBefore(newCrunchy, _snake);
  };
  
  var _snakeCollided = function(){
    clearInterval(_crunchyInterval);
    _snake.paused = true;
  };
  
  var _snake = new Snake(100, 200, 100, 2, 10, _snakeCollided)
  _loop.add(_snake);
  _loop.add(this);
  _loop.frameRate(60);
  _loop.showInfo(true);
   
  this.start = function(){
    _points = 0;
    _snake.reset(100, 200, 100, 2, 10);
    _snake.paused = false;
    _crunchyInterval = setInterval(_crunchy, 3000);
    _loop.start();
  };
  
  this.stop = function(){
    clearInterval(_crunchyInterval);
    _loop.stop();
  };
  
  this.pause = function(){
    clearInterval(_crunchyInterval);
    _paused = true;
    _snake.paused = true;
  };
  
  this.resume = function(){
    _crunchyInterval = setInterval(_crunchy, 3000);
    _paused = false;
    _snake.paused = false;
  };
  
       
  var _keyHandler = function(evt) {
    switch(evt.keyCode) {
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
var Snake = function(x, y, length, direction, thickness, collisionCallback){
  var _nodes = [],
  _nodeIndex = 1,  
  _length = 0,
  _drawn = 0,
  _rest = 0,
  _currentDirection = -1,
  _speed = 75,
  _movedDistance = 0,
  _thickness = thickness,
  _halfThickness = thickness / 2;
  _collisionCallback = collisionCallback;
  
  this.reset = function(_x, _y, length, direction){
    _nodes = [{ d: direction, x: x, y: y }];
    _length = length;
    _currentDirection = direction;
  };
  
  this.length = function(length){
    if(length)
      _length = length;
    return _length;
  };
  
  this.speed = function(speed){
    if(speed)
      _speed = speed;
    return _speed;
  };
  
  this.thickness = function(){
    return _thickness;
  }
  
  this.pos = function(){
    return _nodes[0];
  };
  
  this.visible = true;
  this.paused = false;
  this.renderContext = this;
  
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
  
  var _checkCollision = function(n0, n1, n2) {
    switch(_currentDirection){
      //top
      case 0:
        if(n1.y != n2.y || !((n0.x > n1.x &&n0.x < n2.x) || (n0.x < n1.x &&n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //bottom
      case 1:
        if(n1.y != n2.y || !((n0.x > n1.x &&n0.x < n2.x) || (n0.x < n1.x &&n0.x > n2.x)))
          break;
        if(Math.abs(n0.y - n1.y) < _movedDistance)
          _collided.call(this);
        break;
      //left
      case 2:
        if(n1.x != n2.x || !((n0.y > n1.y &&n0.y < n2.y) || (n0.y < n1.y &&n0.y > n2.y)))
          break;
        if(Math.abs(n0.x - n1.x) < _movedDistance)
          _collided.call(this);
        break;
      //right
      case 3:
        if(n1.x != n2.x || !((n0.y > n1.y &&n0.y < n2.y) || (n0.y < n1.y &&n0.y > n2.y)))
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
    
    context.beginPath();
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
    
  };
  
  this.move = function(direction){
    if((_currentDirection == 0 && direction == 1) || (_currentDirection == 1 && direction == 0)
      || (_currentDirection == 2 && direction == 3) || (_currentDirection == 3 && direction == 2))
      return;
    _nodes.splice(1, 0, { d: _currentDirection, x: _nodes[0].x, y: _nodes[0].y});
    _currentDirection = _nodes[0].d = direction;
  };
  
  this.reset(x, y, length, direction);
};
    