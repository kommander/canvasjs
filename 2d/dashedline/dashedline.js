/**
 * A dashed line implementation for the HTML5 2D canvas
 * based on the AS3 implementation from github.com/kommander/as3components
 *
 * This implementation extends the CanvasRenderingContext2D,
 * adds the dashed line functionality directly to it
 * and tries to follow the actual W3 HTML5 specs from http://dev.w3.org/html5/2dcontext/
 * 
 * author Sebastian Herrlinger <sebastian@formzoo.com>
 * url sebastian.formzoo.com
 *
 * Copyright 2011 Sebastian Herrlinger
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
  var slope = (y - this.currentMoveY) / (x - this.currentMoveX);
  var startX = this.currentMoveX;
  var startY = this.currentMoveY;
  var xDir = (x < startX) ? -1 : 1;
  var yDir = (y < startY) ? -1 : 1;
  
  outerLoop : while (Math.abs(startX - this.currentMoveX) < Math.abs(startX - x) || Math.abs(startY - this.currentMoveY) < Math.abs(startY - y))
  {
    for (var i = this.lengthStartIndex; i < this.dashPattern.length; i++)
    {
        var dist = (this.remainingDist == 0) ? this.dashPattern[i] : this.remainingDist;
        var coords = this.getCoords(dist, slope);
        var xInc = coords[0] * xDir;
        var yInc = coords[1] * yDir;
        
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
          
          this.lengthStartIndex = 0;
          this.remainingDist = 0;
        } else {
          this.remainingDist = this.distance(this.currentMoveX, this.currentMoveY, x, y); 
          this.lengthStartIndex = i;
          break outerLoop;
        }
    }
  }
  
  if (this.remainingDist != 0)
  {
    if (this.lengthStartIndex % 2 == 0)
      this.superLineTo(x,y);
    else
      this.superMoveTo(x,y);
    this.remainingDist = this.dashPattern[this.lengthStartIndex] - this.remainingDist;
  } else {
    if (this.lengthStartIndex == this.dashPattern.length - 1)
      this.lengthStartIndex = 0;
    else
      this.lengthStartIndex++;
  }
  this.currentMoveX = x;
  this.currentMoveY = y;
}

CanvasRenderingContext2D.prototype.remainingDist = 0;
CanvasRenderingContext2D.prototype.lengthStartIndex = 0;
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

CanvasRenderingContext2D.prototype.bezierPrecision = .001;
CanvasRenderingContext2D.prototype.dashedBezierCurveTo = function(fromX, fromY, cp1x, cp1y, cp2x, cp2y, toX, toY)
{
  var xbefore = fromX;
  var ybefore = fromY;
  var traveled = 0;
  var draw = true;
  var renderSteps = 0;
  var skipped = 0;
  var dashLength = (this.remainingDist == 0) ? this.dashPattern[this.lengthStartIndex] : this.remainingDist;
  
  for(t = .0; t <= 1.0; t += this.bezierPrecision)
  {
    
    var x = this.bezierCoordForTime(fromX, cp1x, cp2x, toX, t);
    var y = this.bezierCoordForTime(fromY, cp1y, cp2y, toY, t);
    
    if(Math.abs(xbefore - x) < .35 && Math.abs(ybefore - y) < .35)
    {
      t += this.bezierPrecision;
      skipped++;
      if(skipped < dashLength * 1.3)
        continue;
      else
        skipped = 0;
    }
      
    
    traveled += this.distance(xbefore, ybefore, x, y);
    if(traveled >= dashLength)
    {
      this.lengthStartIndex = (this.lengthStartIndex == this.dashPattern.length - 1) ? 0 : this.lengthStartIndex + 1;
      dashLength = this.dashPattern[this.lengthStartIndex];
      draw = (this.lengthStartIndex % 2 == 0) ? true : false;
      this.superStroke();
      this.superBeginPath();
      traveled = 0;
    }
    
    if(draw){
      this.superLineTo(x, y);
    }
    
    xbefore = x;
    ybefore = y;
    renderSteps++;
  }
  this.remainingDist = this.dashPattern[this.lengthStartIndex] - traveled;
}

CanvasRenderingContext2D.prototype.distance = function(fromX, fromY, toX, toY)
{
  return Math.sqrt(Math.pow((toX - fromX),2) + Math.pow((toY - fromY), 2))
}

CanvasRenderingContext2D.prototype.bezierCoordForTime = function(p0, p1, p2, p3, t)
{
  return Math.pow((1 - t), 3) * p0 + 3 * Math.pow((1 - t), 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
}

CanvasRenderingContext2D.prototype.superBezierCurveTo = CanvasRenderingContext2D.prototype.bezierCurveTo;
CanvasRenderingContext2D.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y)
{
  if(this.currentSubPath == null)
  {
    this.currentSubPath = [];
    this.subPaths.push(this.currentSubPath);
  }
  
  this.currentSubPath.push(['b', cp1x, cp1y, cp2x, cp2y, x, y]);
}

CanvasRenderingContext2D.prototype.dashedArc = function(x, y, radius, startAngle, endAngle, anticlockwise)
{
  var currentAngle = startAngle;
  var targetAngle = endAngle;
  
  outerLoop : while (currentAngle < targetAngle)
  {
    for (var i = this.lengthStartIndex; i < this.dashPattern.length; i++)
    {
        var angleStep = ((this.remainingDist == 0) ? this.dashPattern[i] : this.remainingDist) / radius;
        
        if (currentAngle + angleStep < targetAngle)
        {
          if (i % 2 == 0)
          {
            this.superBeginPath();
            this.superArc(x, y, radius, currentAngle, currentAngle + angleStep, false);
            this.superStroke();
          } 
          currentAngle += angleStep;
          
          this.lengthStartIndex = 0;
          this.remainingDist = 0;
        } else {
          this.lengthStartIndex = i;
          this.remainingDist = (targetAngle - currentAngle) * radius; 
          break outerLoop;
        }
    }
  }
  
  if (this.remainingDist != 0)
  {
    if (this.lengthStartIndex % 2 == 0)
    {
      this.superBeginPath();
      this.superArc(x, y, radius, currentAngle, endAngle, false);
      this.superStroke();
    }
    this.remainingDist = this.dashPattern[this.lengthStartIndex] - this.remainingDist;
  } else {
    if (this.lengthStartIndex == this.dashPattern.length - 1)
      this.lengthStartIndex = 0;
    else
      this.lengthStartIndex++;
  }
}

CanvasRenderingContext2D.prototype.superRect = CanvasRenderingContext2D.prototype.rect;
CanvasRenderingContext2D.prototype.rect = function(x, y, width, height)
{
  this.currentSubPath = [];
    this.subPaths.push(this.currentSubPath);
  
  this.currentSubPath.push(['m', x, y]);
  this.currentSubPath.push(['l', x + width, y]);
  this.currentSubPath.push(['l', x + width, y + height]);
  this.currentSubPath.push(['l', x, y + height]);
  this.closePath();
}

CanvasRenderingContext2D.prototype.superStrokeRect = CanvasRenderingContext2D.prototype.strokeRect;
CanvasRenderingContext2D.prototype.strokeRect = function(x, y, width, height)
{
  if(this.dashed)
  {
    var cmxyb = [this.currentMoveX, this.currentMoveY];
    this.currentMoveX = x;
    this.currentMoveY = y;
    this.superBeginPath();
    this.superMoveTo(x, y);
    this.dashedLineTo(x + width, y);
    this.dashedLineTo(x + width, y + height);
    this.dashedLineTo(x, y + height);
    this.dashedLineTo(x, y);
    this.superStroke();
    this.currentMoveX = cmxyb[0];
    this.currentMoveY = cmxyb[1];
  } else {
    this.superStrokeRect(x, y, width, height);
  }
}

CanvasRenderingContext2D.prototype.superArc = CanvasRenderingContext2D.prototype.arc;
CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise)
{
  if(this.currentSubPath != null && this.currentSubPath.length > 0)
  {
    this.currentSubPath.push(['al', x + radius * Math.cos(startAngle), y + radius * Math.sin(startAngle)]);
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
  
  for(var sk = 0; sk < this.subPaths.length; sk++)
  {
    
    for(var k = 0; k < this.subPaths[sk].length; k++)
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
          this.superArc(this.subPaths[sk][k][1], this.subPaths[sk][k][2], this.subPaths[sk][k][3], this.subPaths[sk][k][4], this.subPaths[sk][k][5], false);
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
  
  for(var sk = 0; sk < this.subPaths.length; sk++)
  {
    if(this.dashed)
    {
      if(this.subPaths[sk].length > 0)
      {
        this.currentMoveX = this.subPaths[sk][0][1];
        this.currentMoveY = this.subPaths[sk][0][2];
      }
      
      for(var k = 0; k < this.subPaths[sk].length; k++)
      {
        switch(this.subPaths[sk][k][0])
        {
          case 'al':
            this.dashedLineTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
            this.superStroke();
            break;
          case 'c':
          case 'l':
            this.dashedLineTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
            break;
          case 'm':
            this.lengthStartIndex = 0;
            this.remainingDist = 0;
          case 'am':
            this.currentMoveX = this.subPaths[sk][k][1];
            this.currentMoveY = this.subPaths[sk][k][2];
            this.superMoveTo(this.subPaths[sk][k][1], this.subPaths[sk][k][2]);
            break;
          case 'a':
            this.dashedArc(this.subPaths[sk][k][1], this.subPaths[sk][k][2], this.subPaths[sk][k][3], this.subPaths[sk][k][4], this.subPaths[sk][k][5]);
            break;
          case 'b':
            this.dashedBezierCurveTo(
              this.currentMoveX, 
              this.currentMoveY, 
              this.subPaths[sk][k][1], 
              this.subPaths[sk][k][2], 
              this.subPaths[sk][k][3], 
              this.subPaths[sk][k][4], 
              this.subPaths[sk][k][5],
              this.subPaths[sk][k][6]
            );
            break;
        }
      }
      
    } else {
      for(var k = 0; k < this.subPaths[sk].length; k++)
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
            this.superArc(this.subPaths[sk][k][1], this.subPaths[sk][k][2], this.subPaths[sk][k][3], this.subPaths[sk][k][4], this.subPaths[sk][k][5], false);
            break;
          case 'b':
            this.superBezierCurveTo(
              this.subPaths[sk][k][1], 
              this.subPaths[sk][k][2], 
              this.subPaths[sk][k][3], 
              this.subPaths[sk][k][4], 
              this.subPaths[sk][k][5],
              this.subPaths[sk][k][6]
            );
            break;
        }
    }
  }
  
  this.superStroke();
}
