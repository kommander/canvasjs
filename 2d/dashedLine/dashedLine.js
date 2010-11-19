/**
 * A dashed line implementation for the HTML5 2D canvas
 * based on the AS3 implementation from github.com/herrlinger/as3components
 *
 * This implementation extends the CanvasRenderingContext2D,
 * adds the dashed line functionality directly to it
 * and tries to follow the actual W3 HTML5 specs from http://dev.w3.org/html5/2dcontext/
 * 
 * @author Sebastian Herrlinger <sebastian@formzoo.com>
 * @url sebastian.formzoo.com
 */
CanvasRenderingContext2D.prototype.superBeginPath = CanvasRenderingContext2D.prototype.beginPath;
CanvasRenderingContext2D.prototype.beginPath = function()
{
  delete this.subPaths;
  this.subPaths = [];
  delete this.currentSubPath;
  this.currentSubPath = null;
}

CanvasRenderingContext2D.prototype.superClosePath = CanvasRenderingContext2D.prototype.closePath;
CanvasRenderingContext2D.prototype.closePath = function()
{
  if(this.subPaths.length == 0)
    return;
  
  if(this.currentSubPath.length > 1)
  {
    this.currentSubPath.push(['c', this.currentSubPath[0][1], this.currentSubPath[0][2]]);
  }
  
  var lastSubPath = this.currentSubPath;
  this.currentSubPath = [];
  this.subPaths.push(this.currentSubPath);
  this.currentSubPath.push(['m', lastSubPath[0][1], lastSubPath[0][2]]);
}

CanvasRenderingContext2D.prototype.subPaths = [];
CanvasRenderingContext2D.prototype.currentSubPath = null;

CanvasRenderingContext2D.prototype.superMoveTo = CanvasRenderingContext2D.prototype.moveTo;
CanvasRenderingContext2D.prototype.moveTo = function (x, y) 
{
  if(this.currentSubPath == null)
  {
    this.currentSubPath = [];
    this.subPaths.push(this.currentSubPath);
  }
  
  this.currentSubPath.push(['m', x, y]);
}

CanvasRenderingContext2D.prototype.getCoords = function(distance, slope) 
{
  var angle = Math.atan(slope);
  var vertical = Math.abs(Math.sin(angle) * distance);
  var horizontal = Math.abs(Math.cos(angle) * distance);
  return [horizontal, vertical];
}

CanvasRenderingContext2D.prototype.dashedLineTo = function (x, y) 
{
  var slope = (y - this.currentMoveY)/(x - this.currentMoveX);
  var startX = this.currentMoveX;
  var startY = this.currentMoveY;
  var xDir = (x < startX) ? -1 : 1;
  var yDir = (y < startY) ? -1 : 1;
  
  
  // keep drawing dashes and gaps as long as either the current x or y is not beyond the destination x or y
  outerLoop : while (Math.abs(startX - this.currentMoveX) < Math.abs(startX - x) || Math.abs(startY - this.currentMoveY) < Math.abs(startY - y))
  {
    for (var i = this.lengthStartIndex; i < this.dashPattern.length; i++)
    {
        var dist = (this.remainingDist == 0) ? this.dashPattern[i] : this.remainingDist;
        var xInc = this.getCoords(dist, slope)[0] * xDir;
        var yInc = this.getCoords(dist, slope)[1] * yDir;
        
        if (Math.abs(startX - this.currentMoveX) + Math.abs(xInc) < Math.abs(startX - x) 
          || Math.abs(startY - this.currentMoveY) + Math.abs(yInc) < Math.abs(startY - y))
        {
          if (i % 2 == 0)
          {
            this.superLineTo(this.currentMoveX + xInc, this.currentMoveY + yInc);
          } else {
            this.superMoveTo(this.currentMoveX + xInc, this.currentMoveY + yInc);
          }
          this.currentMoveX += xInc;
          this.currentMoveY += yInc;
          this.curLengthIndex = i;
          this.lengthStartIndex = 0;
          this.remainingDist = 0;
        } else {
          this.remainingDist = Math.sqrt(Math.pow((x - this.currentMoveX),2) + Math.pow((y - this.currentMoveY), 2)); 
          this.curLengthIndex = i;
          break outerLoop;
        }
    }
  }
  
  this.lengthStartIndex = this.curLengthIndex;

  if (this.remainingDist != 0)
  {
    if (this.curLengthIndex % 2 == 0)
      this.superLineTo(x,y);
    else
      this.superMoveTo(x,y);
    this.remainingDist = this.dashPattern[this.curLengthIndex] - this.remainingDist;
  } else {
    if (this.lengthStartIndex == this.dashPattern.length - 1)
      this.lengthStartIndex = 0;
    else
      this.lengthStartIndex++;
  }
  this.currentMoveX = x;
  this.currentMoveY = y;
}

CanvasRenderingContext2D.prototype.dashed = false;
CanvasRenderingContext2D.prototype.dashPattern = [10, 4];
CanvasRenderingContext2D.prototype.superLineTo = CanvasRenderingContext2D.prototype.lineTo;
CanvasRenderingContext2D.prototype.lineTo = function(x, y)
{
  if(this.currentSubPath == null)
  {
    this.currentSubPath = [];
    this.subPaths.push(this.currentSubPath);
  }
  
  this.currentSubPath.push(['l', x, y]);
}

CanvasRenderingContext2D.prototype.superArc = CanvasRenderingContext2D.prototype.arc;
CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise)
{
  if(this.currentSubPath != null && this.currentSubPath.length > 0)
  {
    this.lineTo(
      x + radius * Math.cos(startAngle), 
      y + radius * Math.sin(startAngle)
    );
  } else {
    this.currentSubPath = [];
    this.subPaths.push(this.currentSubPath);
  }
  
  this.currentSubPath.push(['a', x, y, radius, startAngle, endAngle]);
  this.currentSubPath.push(['am', x + radius * Math.cos(endAngle), y + radius * Math.sin(endAngle)]);
}

CanvasRenderingContext2D.prototype.superFill = CanvasRenderingContext2D.prototype.fill;
CanvasRenderingContext2D.prototype.fill = function()
{
  this.superBeginPath();
  
  for(sk in this.subPaths)
  {
    
    for(k in this.subPaths[sk])
    {
      switch(this.subPaths[sk][k][0])
      {
        case 'c':
          this.superClosePath();
          break;
        case 'l':
          this.superLineTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
          break;
        case 'm':
          this.superMoveTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
          break;
        case 'a':
          this.superArc(this.subPaths[sk][k][1], this.subPaths[sk][k][2], this.subPaths[sk][k][3], this.subPaths[sk][k][4], this.subPaths[sk][k][5]);
          break;
      }
    }
    
  }
  this.superFill();
}

CanvasRenderingContext2D.prototype.superStroke = CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype.stroke = function()
{
  this.superBeginPath();
  
  for(sk in this.subPaths)
  {
    if(this.dashed)
    {
      if(this.subPaths[sk].length > 0)
      {
        this.currentMoveX = this.subPaths[sk][0][1];
        this.currentMoveY = this.subPaths[sk][0][2];
      }
      
      for(k in this.subPaths[sk])
      {
        switch(this.subPaths[sk][k][0])
        {
          case 'c':
          case 'l':
            this.dashedLineTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
            break;
          case 'am':
          case 'm':
            this.currentMoveX = this.subPaths[sk][k][1];
            this.currentMoveY = this.subPaths[sk][k][2];
            this.lengthStartIndex = 0;
            this.remainingDist = 0;
            this.curLengthIndex = 0;
            this.superMoveTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
            break;
          case 'a':
            this.superArc(this.subPaths[sk][k][1], this.subPaths[sk][k][2], this.subPaths[sk][k][3], this.subPaths[sk][k][4], this.subPaths[sk][k][5]);
            break;
        }
      }
      
    } else {
      for(k in this.currentSubPath)
        switch(this.currentSubPath[k][0])
        {
          case 'l':
            this.superLineTo(this.currentSubPath[k][1], this.currentSubPath[k][2]);
            break;
          case 'm':
            this.superMoveTo(this.currentSubPath[k][1], this.currentSubPath[k][2]);
            break;
          case 'a':
            this.superArc(this.currentSubPath[k][1], this.currentSubPath[k][2], this.currentSubPath[k][3], this.currentSubPath[k][4], this.currentSubPath[k][5]);
            break;
        }
    }
  }
  
  this.superStroke();
}
