/**
 * canvas.js
 * Basic functionality, reused by other components
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 *
 * TODO: makefile with "make release"
 *
 * Copyright 2011 Sebastian Herrlinger
 */
 
// Namespaces
var kk = {};            // kosmokommando base namespace
kk.g2d = {};            // All 2d
kk.g2d.obj = {};        // Reusable 2d loop objects

/**
 * Bind a function to a specific context
 */
if(!Function.prototype.bind){
  Function.prototype.bind = function(){
    var _args = arguments;
    var _self = this;
    return function(){
      return _self.apply((_args[0]) ? _args[0] : null, Array.prototype.slice.call(_args, 1).concat(Array.prototype.slice.call(arguments)));
    }
  };
}

/**
 * Extend an objects public attributes with publics from another
 */
kk.extend = function() {
  for(var i = 1; i < arguments.length; i++){
    for(var k in arguments[i]){
      arguments[0][k] = arguments[i][k];
    }
  }
};

/**
 * Subclassing with privates
 */
kk.Class = function(){ this.init = function(){}; };
kk.Class.initializing = false;
kk.Class.extend = function(o) {
  
  kk.Class.initializing = true;
  var _super = new this();
  kk.Class.initializing = false;
  
  var Class = function() {
    this._super = _super;
    if(!kk.Class.initializing) {
      o.init.apply(this, arguments);
      for(k in this._super){
        if(typeof(this._super[k]) == 'function' && k != 'init' && k != '_super'){
          var sup = this._super;
          while(sup._super){
            this[k] = sup[k].bind(this);
            sup = sup._super;
          }
        }
      }
    }
  };
  
  Class.prototype = _super;
  if(this.__s){
    _super.init = this.__s;
  }
  Class.__s = o.init;
  Class.constructor = Class;
  Class.extend = arguments.callee;
  
  return Class;
};

/**
 * Rotate a path array with [x, y, x, y, ... ]
 */
kk.g2d.rotatePath = function(path, sinus, cosinus) {
  var x = 0;
  for(var i = 0; i < path.length; i += 2) {
    x = (path[i] * cosinus - path[i + 1] * sinus);
    path[i + 1] = (path[i + 1] * cosinus + path[i] * sinus);
    path[i] = x; 
  }
};

/**
 * Get a random number between a min and a max number
 */
kk.rand = function(minNum, maxNum) 
{
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
};