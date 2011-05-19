/**
 * canvas.js
 * Basic functionality, reused by other components
 *
 * TODO: add namespaces
 * TODO: makefile with "make release"
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