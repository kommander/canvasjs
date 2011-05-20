/**
 * input.js
 * Handle common input
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 *
 * TODO: Add mouse handling and give callback event + mouseDelta
 *
 * Copyright 2011 Sebastian Herrlinger
 */

kk.Input = new (function(){
  //This is a map of the possible keyboard inputs we handle
  var _typeMap = {
    a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80,
    q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, left: 37, up: 38, right: 39, down: 40,
    space: 32
  },
  _actions = {},
  _has = {},
  _hasName = {},
  
  /**
   * Handle key input if keyboard is active
   */
  _keyHandler = function(e){
    var type = (e.type == 'keydown') ? 1 : 0;
    for(var k in _actions[e.keyCode]){
      if(type == 1) {
        _has[e.keyCode] = true;
        if(!_actions[e.keyCode][k].lock){
          _actions[e.keyCode][k].lock = true;
          _actions[e.keyCode][k].df(e);
          _hasName[_actions[e.keyCode][k].name] = true;
        }
      } else {
        _has[e.keyCode] = false;
        _actions[e.keyCode][k].lock = false;
        _actions[e.keyCode][k].uf(e);
        _hasName[_actions[e.keyCode][k].name] = false;
      }
    }
    e.stopPropagation();
    e.preventDefault();
  };
  
  /**
   * Binds a name and optionally a down and up callback to a input type
   */
  _bind = function(type, name, down, up){
    if(typeof(_actions[_typeMap[type]]) != 'object')
      _actions[_typeMap[type]] = {};
    _actions[_typeMap[type]][name] = {
      name: name,
      lock: false,
      df: typeof(down) == 'function' ? down : function(){},
      uf: typeof(up) == 'function' ? up : function(){}
    };
  }
  
  /**
   * Unbinds a name and its optional callbacks from a input type
   */
  _unbind = function(type, name) {
    delete _actions[_typeMap[type]][name];
    delete _hasName[name];
  };
  
  /**
   * Returns true if the given input type is present
   */
  this.has = function(type) {
    return _has[_typeMap[type]];
  };
  
  /**
   * Returns true if the specified input name is given
   */
  this.hasName = function(name) {
    return _hasName[name];
  };
  
  /**
   * Public accessor to bind a name and optional callbacks to an input
   */
  this.bind = function(types, name, down, up) {
    if(typeof(types) == 'string')
      _bind(types, name, down, up);
    else if(types.constructor == Array)
      for(var i = 0; i < types.length; i++)
        this.bind(types[i], name, down, up);
    return this;
  };
  
  /**
   * Public accessor to unbind a name and optional callbacks from an input
   */
  this.unbind = function(types, name) {
    if(typeof(types) == 'string')
      _unbind(types, name);
    else if(types.constructor == Array)
      for(var i = 0; i < types.length; i++)
        this.unbind(types[i], name);
    return this;
  }
  
  //TODO: add functionality to activate and deactivate the keyboard and mouse input
  window.addEventListener('keydown', _keyHandler.bind(this), false);
  window.addEventListener('keyup', _keyHandler.bind(this), false);
})();