/**
 * input.js
 * Handle common input
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 */

var Input = new (function(){
  var _typeMap = {
    a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80,
    q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, left: 37, up: 38, right: 39, down: 40,
    space: 32
  },
  _actions = {},
  
  _keyDownHandler = function(e){
    for(var k = 0; k < ((_actions[e.keyCode]) ? _actions[e.keyCode].length : 0); k++){
      if(!_actions[e.keyCode][k].lock){
        _actions[e.keyCode][k].lock = true;
        _actions[e.keyCode][k].f(e);
      }
    }
    e.stopPropagation();
    e.preventDefault();
  };
  
  _keyUpHandler = function(e){
    for(var k = 0; k < ((_actions[e.keyCode]) ? _actions[e.keyCode].length : 0); k++){
      _actions[e.keyCode][k].lock = false;
    }
    e.stopPropagation();
    e.preventDefault();
  },
  
  _bind = function(type, callback){
    if(typeof(_actions[_typeMap[type]]) != 'object')
      _actions[_typeMap[type]] = [];
    _actions[_typeMap[type]].push({
      lock: false,
      f: callback
    });
  }; 
  
  this.bind = function(types, callback) {
    if(typeof(types) == 'string')
      _bind(types, callback);
    else if(types.constructor == Array)
      for(var i = 0; i < types.length; i++)
        this.bind(types[i], callback);
    return this;
  };
  
  window.addEventListener('keydown', _keyDownHandler.bind(this), false);
  window.addEventListener('keyup', _keyUpHandler.bind(this), false);
})();