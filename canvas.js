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
  Function.prototype.bind= function(to){
    var _self = this;
    return function(){
      return _self.apply((to) ? to : null, Array.prototype.slice.call(arguments));
    }
  };
}

/**
 * Get a random number between a min and a max number
 */
kk.rand = function(minNum, maxNum) 
{
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
};