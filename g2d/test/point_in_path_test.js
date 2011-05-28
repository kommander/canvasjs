var canvas = kk.$('#testCanvas');
var context = canvas.getContext('2d');

var o = function(x, y, rotation, path){
  var _sinBuf = 0,
  _cosBuf = 0,
  _rotation = 0;
  
  this.x = x;
  this.y = y;
  this.path = path;
  
  this.rotation = function(rot){
    if(rot != undefined) {
      _rotation = rot;
      _sinBuf = Math.sin(rot);
      _cosBuf = Math.cos(rot);
      var x = 0;
      var y = 0;
      for(var i = 0; i < this.path.length; i += 2) {
        x = (this.path[i] * _cosBuf - this.path[i+1] * _sinBuf);
        y = (this.path[i+1] * _cosBuf + this.path[i] * _sinBuf);
        this.path[i] = x; 
        this.path[i+1] = y;
      }
    }
    return _rotation;
  };
  this.rotation(rotation);
  
  this.drawPath = getDrawPathFunction(this);
  this.colliders = [];
  this.color = '#0f0';
  this.bradius = 0;
  
  for(var i = 0; i < this.path.length; i += 2) {
    var dist = kk.g2d.Trig.getDistance(this, {x: this.path[i] + this.x, y: this.path[i+1] + this.y});
    if(dist > this.bradius){
      this.bradius = dist;
    }
  }
  
  this.draw = function(context) {
    context.save();
    context.beginPath();
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
    context.beginPath();
    context.translate(this.x, this.y);
    this.drawPath(context);
    context.stroke();
    context.closePath();
    context.restore();
  };
  
  this.collidesWith = function(context, other) {
    if(kk.g2d.Trig.getDistance(this, other) < this.bradius + other.bradius) {
      context.save();
      context.beginPath();
      context.translate(other.x, other.y);
      other.drawPath(context);
      context.closePath();
      context.restore();
      
      for(var i = 0; i < this.path.length; i += 2) {
        if(context.isPointInPath(this.path[i] + this.x, this.path[i+1] + this.y)){
          return true;
        }
      }
    }
    return false;
  };
  
  this.tick = function(context, timeDiff) {
    //this.rotation(_rotation + 1);
    this.color = '#0f0';
    for(var i = 0; i < this.colliders.length; i++) {
      if(this.collidesWith(context, this.colliders[i])){
        this.color = '#f00';
      }
      
    }
    this.draw(context);
    
    //draw path points
    /*
    context.save();
    for(var i = 0; i < this.path.length; i += 2) {
      context.beginPath();
      context.fillStyle = '#00f';
      context.arc(this.path[i] + this.x, this.path[i+1] + this.y, 3, 0, Math.PI * 2, false);
      context.fill();
      context.closePath();
    }
    context.restore();
    */
    
    /*
    //draw bradius
    context.save();
    context.beginPath();
    context.strokeStyle = '#00f';
    context.arc(this.x, this.y, this.bradius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
    context.restore();
    */
  };
  
};

function getDrawPathFunction(obj) {
  var f = '(function(ctx) {' +
    'ctx.moveTo(' + obj.path[0] + ', ' + obj.path[1] + ');';
  for(var i = 2; i < obj.path.length; i += 2) {
    f += 'ctx.lineTo(' + obj.path[i] + ', ' + obj.path[i+1] + ');';
  }
  f += 'ctx.lineTo(' + obj.path[0] + ', ' + obj.path[1] + ');})';
  return eval(f);
}

var o1 = new o(50, 50, 45, [-20, -20, -20, 10, 20, 20, 20, -10]);

var loop = new kk.Loop(context, 60).showInfo(true).push(o1);

for(var i = 0; i < 100; i++) {
  var o2 = new o(kk.rand(0, 400), kk.rand(0, 400), kk.g2d.Trig.PI180 * kk.rand(0, 360), 
    [-kk.rand(1, 20), -kk.rand(5, 10), -kk.rand(5, 20), kk.rand(5, 20), kk.rand(5, 20), kk.rand(5, 10), kk.rand(5, 20), -kk.rand(5, 20)]);
  o1.colliders.push(o2);
  o2.colliders.push(o1);
  loop.push(o2);
}

loop.start();

canvas.addEventListener('mousemove', function(e){
  o1.x = e.clientX - e.target.offsetLeft + window.scrollX;
  o1.y = e.clientY - e.target.offsetTop + window.scrollY;
}, false);