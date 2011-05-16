/**
 * A 2D Vector
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * License: GPL
 * 
 * Based on a AS3 implementation by jimisaacs (http://ji.dd.jimisaacs.com)
 */

function Vector2D(x, y, angle) {
  this.angle = angle;
  this.x = x;
  this.y = y;
  
  /** 
   * Move based on angle of trajectory and magnitude of distance
   * a - the angle to move in
   * m - how far to move 
   */
  this.move = function(a, m) {
    _x += Math.cos(Trig.radian(a)) * m;
    _y += Math.sin(Trig.radian(a)) * m;
  };
   
  /**
   * Move left based on the direction angle
   * m - how far to move 
   */
  this.left = function(m) {
    this.move(this.angle - 90, m);
  };
  
  /**
   * Move right based on the direction angle
   * m - how far to move 
   */
  this.right = function(m) {
    this.move(this.angle + 90, m);
  };
   
  /**
   * Move forward based on the direction angle
   * m - how far to move 
   */
  this.forward = function(m) {
    this.move(this.angle, m);
  };
  
  /**
   * Move backward based on the direction angle
   * m - how far to move 
   */
  this.backward = function(m) {
    this.move(this.angle - 180, m);
  };
  
  /**
   * Set angle to face the given point
   * p - the geometric point 
   */
  this.angleTo = function(p) {
    return this.angle = Trig.getAngle(this, p);
  };
  
  /**
   * Get the distance from this instance to a given point
   * p - the geometric point 
   */
  this.distance = function(p) {
    return Trig.getDistance(this, p);
  };
}