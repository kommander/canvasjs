# CanvasJS
#### Experiments in HTML5 Canvas

## Description
canvasjs (for the lack of a better name) slowly evolves as a small library,
and as such it has some structure like namespaces for the objects it contains:

* kk      - is the base namespace for kosmokommando
* kk.g2d  - keeps all the 2d specific stuff

## Contents
### Loop.js 

Path: ./loop
Namespace: kk.Loop

A simple animation loop with a basic API for a 2D canvas context,
which takes objects and provides them with an animation and draw tick.

### Sprite & SpriteAnimation 

Path: ./g2d
Namespace: kk.g2d.Sprite & kk.g2d.SpriteAnimation

A simple Sprite implementation and an Animation layer for it.

### ResourceLoader 

Path: ./
Namespace: kk.ResourceLoader

Batch loads resources and handles events with custom callbacks.

### SnakeGame

Path: ./g2d/snake/
Namespace: kk.g2d.snake

A classic Snake game leveraging Loop.js.

### DashedLine

Path: ./g2d/dashedLine/
Namespace: extends the 2d context directly

Extends the canvas 2D context with dashed line drawing functionality,
completely fitting into the context path draw API.

### Vector2D & Trig

Path: ./d2d/geometry/
Namespace: kk.g2d.Vector2D & kk.g2d.Trig

A 2D Vector and reusable trigonometric functions.

## TODO

* Readme with usage examples
* Mouse input handling (over, out & click for sprites and animations)
* collision
* document g2d/objects & input

&copy; Copyright 2011 Sebastian Herrlinger