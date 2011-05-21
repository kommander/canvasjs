/**
 * FlashText
 * an Object for Loop.js 
 * Creates a text with specific visual settings and animates it to appear
 * and fade away again, to visualize gathered points in a game for example.
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.obj.FlashText = function(options){
    
  var _msgs = [],
  _msgOptions = ['x', 'y', 'color', 'delay', 'speed', 'timeout', 'align', 'font', 'shadowColor', 'shadowAlpha', 'shadowBlur', 'alpha'];
  
  //Get options and init
  if(!options){
    options = {};
  }
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.color = options.color || '#000';
  this.delay = options.delay || 0;
  this.speed = options.speed || 50;
  this.timeout = options.timeout || 1000;
  this.align = options.align || 'center';
  this.font = options.font || '800 20px Comic Sans, Tahoma';
  this.shadowColor = ((options.shadowColor) ? hex2rgb(options.shadowColor) : false) || 'rgba(200, 200, 200,';
  this.shadowAlpha = options.shadowAlpha || 1;
  this.shadowBlur = options.shadowBlur || 5;
  this.alpha = options.alpha || 1;
  
  /**
   * Add a flash message for rendering
   */
  this.msg = function(msg, options){
    var msg = { msg: msg, time: 0 };
    if(!options){
      options = {};
    }
    for(var i = 0; i < _msgOptions.length; i++) {
      msg[_msgOptions[i]] = options[_msgOptions[i]] || this[_msgOptions[i]];
    }
    msg.alphaPS = msg.alpha / (msg.timeout / 1000);
    msg.shadowAlphaPS = msg.shadowAlpha / (msg.timeout / 1000);
    _msgs.push(msg);
  };
  
  /**
   * Render the texts
   */
  this.tick = function(context, timeDiff){
    _timeSecond = timeDiff * 0.001;
    
    //Draw flash messages
    for(var i = 0; i < _msgs.length; i++){
      _msgs[i].time += timeDiff;
      if(_msgs[i].time >= _msgs[i].timeout){
        _msgs.splice(i, 1);
        continue;
      }
      
      context.save();
      context.globalAlpha = (_msgs[i].alpha -= _timeSecond * _msgs[i].alphaPS);
      context.fillStyle = _msgs[i].color;
      context.shadowColor = _msgs[i].shadowColor + (_msgs[i].shadowAlpha -= _timeSecond * _msgs[i].shadowAlphaPS) + ')';
      context.shadowBlur = _msgs[i].shadowBlur;
      context.font = _msgs[i].font;
      context.textAlign = _msgs[i].align;
      context.fillText(_msgs[i].msg, _msgs[i].x, _msgs[i].y - _msgs[i].time * 0.15);
      context.restore();
    }
    
    
  };
  
  /**
   * http://snipplr.com/view/43542/hex-to-rgb-or-rgba-transluder/
   */
  function hex2rgb(hex) {
    var rgb = hex.replace('#', '').match(/(.{2})/g);
   
    var i = 3;
    while (i--) {
      rgb[i] = parseInt(rgb[i], 16);
    }
   
    return 'rgba(' + rgb.join(', ') + ',';
  };
};