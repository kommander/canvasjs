/**
 * canvas.js
 * Basic functionality, reused by other components
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 *
 * TODO: add namespaces
 * TODO: makefile with "make release"
 *
 * Copyright 2011 Sebastian Herrlinger
 */

/**
 * Bind a function to a specific context
 */
if(!Function.prototype.bind)
  Function.prototype.bind= function(to){
    var _self = this;
    return function(){
      return _self.apply((to) ? to : null, Array.prototype.slice.call(arguments));
    }
  };