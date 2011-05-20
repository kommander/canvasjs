# CanvasJS
#### Experiments in HTML5 Canvas

## Description
canvasjs (for the lack of a better name) slowly evolves as a small library,
and as such it has some structure like namespaces for the objects it contains:

* kk      - is the base namespace for kosmokommando
* kk.g2d  - keeps all the 2d specific stuff

## Contents
### Loop.js - ./loop - kk.Loop
A simple animation loop with a basic API for a 2D canvas context,
which takes objects and provides them with an animation and draw tick.

### SnakeGame - ./g2d/snake/ - kk.g2d.snake
A classic Snake game leveraging Loop.js.

### DashedLine - ./g2d/dashedLine/ - no namespace, extends the 2d context directly
Extends the canvas 2D context with dashed line drawing functionality,
completely fitting into the context path draw API.

### Vector2D & Trig - ./d2d/geometry/ - kk.g2d.Vector2D & kk.g2d.Trig
A 2D Vector and reusable trigonometric functions.

&copy; Copyright 2011 Sebastian Herrlinger