/**
 * A 2D Vector
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * License: GPL
 * 
 * Based on a AS3 implementation by jimisaacs (http://ji.dd.jimisaacs.com)
 */

kk.g2d.Vector2D = kk.Class.extend({
  
  //Constructor
  init: function(x, y, angle) {
    this.angle = angle;
    this.x = x;
    this.y = y;
  },
  
  //Attributes
  x: 0,
  y: 0,
  angle: 0,
  
  /** 
   * Move based on angle of trajectory and magnitude of distance
   * a - the angle to move in
   * m - how far to move 
   */
  move: function(a, m) {
    this.x += Math.cos(a) * m;
    this.y += Math.sin(a) * m;
  },
   
  /**
   * Move left based on the direction angle
   * m - how far to move 
   */
  left: function(m) {
    this.move(this.angle - 1.5707963267948966192313216916398, m);
  },
  
  /**
   * Move right based on the direction angle
   * m - how far to move 
   */
  right: function(m) {
    this.move(this.angle + 1.5707963267948966192313216916398, m);
  },
   
  /**
   * Move forward based on the direction angle
   * m - how far to move 
   */
  forward: function(m) {
    this.move(this.angle, m);
  },
  
  /**
   * Move backward based on the direction angle
   * m - how far to move 
   */
  backward: function(m) {
    this.move(this.angle - Math.PI, m);
  },
  
  /**
   * Set angle to face the given point
   * p - the geometric point 
   */
  angleTo: function(p) {
    return this.angle = kk.g2d.Trig.getAngle(this, p);
  },
  
  /**
   * Get the distance from this instance to a given point
   * p - the geometric point 
   */
  distance: function(p) {
    return kk.g2d.Trig.getDistance(this, p);
  },
  
  /**
   * Get the distance without applying square root for comparison
   */
  comparableDistance: function(p) {
    return kk.g2d.Trig.getSquaredDistance(this, p);
  },
  
  /**
   * Get the dot product of this vector to another vector
   */
  dotProduct: function(other) {
    return this.x * other.x + this.y * other.y;
  },
  
  /**
   * Returns a new vector with the same attributes as this
   */
  copy: function(){
    return new kk.g2d.Vector2D(this.x, this.y, this.angle);
  }
});