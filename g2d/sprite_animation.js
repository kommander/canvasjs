/**
 * SpriteAnimation
 * Animates a series of tiles
 *
 * TODO: on stop render last frame of the sprite
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.SpriteAnimation = kk.g2d.Vector2D.extend({
  
  //Constructor
  init: function(sprite) {
    this._super.init(0, 0, 0);
    this._sprite = sprite;
  },
  
  //Private Attributes
  _sprite: null,
  _animations: {},
  _empty: { play: function(){} },
  _playing: this._empty,
  
  _once: function() {
    this.pos = Math.min(++this.pos, this.frames.length - 1);
  },
  
  _loop: function() {
    this.pos = (this.pos == this.frames.length - 1) ? 0 : this.pos + 1;
  },
  
  _bounce: function() {
    this.pos += this.direction;
    if(this.pos == this.frames.length - 1 || this.pos == 0) {
      this.direction *= -1;
    }
  },
  
  /**
   * Create an animation from the given sprite frames,
   * save it with the given name.
   */
  setup: function(name, frames, options) {
    if(!options)
      options = {};
    
    this._animations[name] = {};
    this._animations[name].frames = [];
    
    if(frames === 'all') {
      for(var i = 0; i < this._sprite.length(); i++) {
        this._animations[name].frames[i] = this._sprite.get(i);
      }
    } 
    if(frames === 'allReverse') {
      for(var i = this._sprite.length() - 1; i >= 0; i--) {
        this._animations[name].frames[i] = this._sprite.get(i);
      }
    } 
    else if(frames.constructor == Array) {
      for(var i = 0; i < frames.length; i++) {
        this._animations[name].frames[i] = this._sprite.get(frames[i]);
      }
    } 
    else if(typeof(frames) == 'object' && frames.from != undefined && frames.to != undefined) {
      var index = 0;
      if(frames.from < frames.to) {
        for(var i = frames.from; i <= frames.to; i++) {
          this._animations[name].frames[index] = this._sprite.get(i);
          index++;
        }
      } else {
        for(var i = frames.from; i >= frames.to; i--) {
          this._animations[name].frames[index] = this._sprite.get(i);
          index++;
        }
      }
    }
    
    this._animations[name].pos = 0;
    this._animations[name].direction = 1;
    this._animations[name].time = 0;
    this._animations[name].startPos = options.startPos || 0;
    this._animations[name].frameTime = options.frameTime || 100;
    
    if(options.bounce) {
      this._animations[name].play = this._bounce;
    }
    else if(options.loop) {
      this._animations[name].play = this._loop;
    } 
    else {
      this._animations[name].play = this._once;
    }
    
  },
  
  /**
   * play an animation that was setup before
   */
  play: function(name) {
    this._animations[name].time = 0;
    this._animations[name].pos = this._animations[name].startPos;
    this._playing = this._animations[name];
  },
  
  /**
   * play from the current position to another
   */
  playTo: function(name, to) {
    //TODO: implement
  },
  
  /**
   * play from the given position to another
   */
  playFromTo: function(name, from, to) {
    //TODO: implement
  },
  
  /**
   * stop an animation
   */
  stop: function() {
    this._playing = _empty;
  },
  
  /** 
   * Render the animations
   */
  tick: function(context, tickTimeDiff) {
    context.save();
    context.translate(this.x, this.y);
    this._playing.time += tickTimeDiff;
    if(this._playing.time >= this._playing.frameTime){
      this._playing.play();
      this._playing.time -= this._playing.frameTime;
    }
    this._playing.frames[this._playing.pos](context);
    context.restore();
  }
});