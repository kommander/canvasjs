# Loop
#### A simple animation loop for HTML5 canvas

Author: Sebastian Herrlinger [sebastian@formzoo.com]
Url: sebastian.formzoo.com
License: MIT

## Description
Basically all that the loop does is keeping a display list of objects,
and per tick (frame) call the tick() method ona all objects from bottom to top in the list.
The tick method gets two arguments:
1. The canvas context for which the loop was created to do rendering on
2. The time difference to the last tick, to do time based animations

## Usage
Create an object with "tick" method and add it to the loop, then start it:
<pre>
var canvas = document.getElementById('testCanvas');
var obj = { tick: function(context, tickTimeDiff){ /* Do something with the context */ } };
var loop = new Loop(canvas.getContext('2d'));
loop.push(obj);
loop.start();
</pre>

## Todo

Mhh... you tell me!