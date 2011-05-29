/**
 * SpriteAnimation
 * Animates a series of tiles
 *
 * TODO: on stop render last frame of the sprite
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.SpriteAnimation = function(sprite){
  kk.extend(this, new kk.g2d.Vector2D(0, 0, 0));
  
  var __ = this, 
  _sprite = sprite,
  _animations = {},
  _empty = { play: function(){} },
  _playing = _empty,
  
  _once = function() {
    this.pos = Math.min(++this.pos, this.frames.length - 1);
  },
  
  _loop = function() {
    this.pos = (this.pos == this.frames.length - 1) ? 0 : this.pos + 1;
  },
  
  _bounce = function() {
    this.pos += this.direction;
    if(this.pos == this.frames.length - 1 || this.pos == 0) {
      this.direction *= -1;
    }
  };
  
  /**
   * Create an animation from the given sprite frames,
   * save it with the given name.
   */
  __.setup = function(name, frames, options) {
    if(!options)
      options = {};
    
    _animations[name] = {};
    _animations[name].frames = [];
    
    if(frames === 'all') {
      for(var i = 0; i < _sprite.length(); i++) {
        _animations[name].frames[i] = _sprite.get(i);
      }
    } 
    if(frames === 'allReverse') {
      for(var i = _sprite.length() - 1; i >= 0; i--) {
        _animations[name].frames[i] = _sprite.get(i);
      }
    } 
    else if(frames.constructor == Array) {
      for(var i = 0; i < frames.length; i++) {
        _animations[name].frames[i] = _sprite.get(frames[i]);
      }
    } 
    else if(typeof(frames) == 'object' && frames.from != undefined && frames.to != undefined) {
      var index = 0;
      if(frames.from < frames.to) {
        for(var i = frames.from; i <= frames.to; i++) {
          _animations[name].frames[index] = _sprite.get(i);
          index++;
        }
      } else {
        for(var i = frames.from; i >= frames.to; i--) {
          _animations[name].frames[index] = _sprite.get(i);
          index++;
        }
      }
    }
    
    _animations[name].pos = 0;
    _animations[name].direction = 1;
    _animations[name].time = 0;
    _animations[name].startPos = options.startPos || 0;
    _animations[name].frameTime = options.frameTime || 100;
    
    if(options.bounce) {
      _animations[name].play = _bounce;
    }
    else if(options.loop) {
      _animations[name].play = _loop;
    } 
    else {
      _animations[name].play = _once;
    }
    
  };
  
  /**
   * play an animation that was setup before
   */
  __.play = function(name) {
    _animations[name].time = 0;
    _animations[name].pos = _animations[name].startPos;
    _playing = _animations[name];
  };
  
  /**
   * play from the current position to another
   */
  __.playTo = function(name, to) {
    //TODO: implement
  };
  
  /**
   * play from the given position to another
   */
  __.playFromTo = function(name, from, to) {
    //TODO: implement
  };
  
  /**
   * stop an animation
   */
  __.stop = function() {
    _playing = _empty;
  };
  
  /** 
   * Render the animations
   */
  __.tick = function(context, tickTimeDiff) {
    context.save();
    context.translate(__.x, __.y);
    _playing.time += tickTimeDiff;
    if(_playing.time >= _playing.frameTime){
      _playing.play();
      _playing.time -= _playing.frameTime;
    }
    _playing.frames[_playing.pos](context);
    context.restore();
  };
};