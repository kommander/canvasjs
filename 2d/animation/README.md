# Loop
#### A simple animation loop for HTML5 canvas

Author: Sebastian Herrlinger [sebastian@formzoo.com]
Url: sebastian.formzoo.com
License: MIT

## Usage
Create an object with at least a "draw" method and add it to the loop, then start it:
<pre>
var obj = { draw: function(context){ /* Do something with the 2D context */ } };
var loop = new Loop();
loop.add(obj);
loop.start();
</pre>

## Todo

* Remove Objects again
* better object render logic
* stat accessors
