/**
 * Ngon
 * A multi edge path object
 * 
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.Ngon = kk.g2d.Vector2D.extend({

  //Construct
  init: function(x, y, path, fillStyle, strokeStyle)
  {
    this._super.init(x, y, 0);
    this._path = path;
    this.fillStyle = fillStyle || null;
    this.strokeStyle = strokeStyle || null;
  },
  
  //Private
  _path: [],
  
  //Pulic
  fillStyle: 0,
  strokeStyle: 0,
  
  /**
   * Connect the path points with lines
   */
  drawPath: function(context) {
    context.moveTo(this._path[0], this._path[1]);
    for(var i = 2; i < path.length; i += 2) {
      context.lineTo(this._path[i], this._path[i+1]);
    }
    context.lineTo(this._path[0], this._path[1]);
  },
  
  /**
   * Draw this object
   */
  draw: function(context) {
    context.save();
    context.beginPath();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    
    this.drawPath(context);
    
    if(this.strokeStyle) {
      context.strokeStyle = this.strokeStyle;
      context.stroke();
    }
    if(this.fillStyle) {
      context.fillStyle = this.fillStyle;
      context.fill();
    }
    
    context.closePath();
    context.restore();
  },
  
  /**
   * Listen for loop ticks
   */
  tick: function(context, tickTimeDiff) {
    this.draw(context);
  },
  
  /**
   * Bake the path in a function to avoid a for loop on each draw
   */
  bakePath: function(path) {
    var f = '(function(ctx) {' +
      'ctx.moveTo(' + path[0] + ', ' + path[1] + ');';
    for(var i = 2; i < path.length; i += 2) {
      f += 'ctx.lineTo(' + path[i] + ', ' + path[i+1] + ');';
    }
    f += 'ctx.lineTo(' + path[0] + ', ' + path[1] + ');})';
    return eval(f);
  },
  
  /**
   * Bake this object
   */
  bake: function() {
    this.drawPath = this.bakePath(this._path);
  }
});