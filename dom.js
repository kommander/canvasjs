/**
 * dom.js
 * Basic DOM Handling to not depend on a full fledged library like jQuery or Prototype
 * for examples and to make it possible to use one if needed.
 * The JS library itself does not need DOM handling.
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * Url: sebastian.formzoo.com
 * License: MIT
 *
 * Copyright 2011 Sebastian Herrlinger
 */

kk.$ = function(selector) {
  var _typeOf = (function(selector) {
    if(typeof(selector) == 'object') {
      return selector;
    } else if(typeof(selector) == 'string') {
      return this.select(selector);
    }
  }).bind(this);
  
  this.makeEvented = function(selector){
    var element = _typeOf(selector);
    
    element.click = (function(f){
      this.click(element, f);
    }).bind(this);
    
    return element;
  };
  
  this.click = function(selector, f){
    var element = _typeOf(selector);
    element.addEventListener('click', f, false);
  };
  
  this.select = function(selector) {
    switch(selector[0]){
      case '#':
        return document.getElementById(selector.substr(1));
    }
  };
  
  return this.makeEvented(selector);
};