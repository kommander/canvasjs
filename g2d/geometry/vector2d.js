/**
 * A 2D Vector
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * License: GPL
 * 
 * Based on a AS3 implementation by jimisaacs (http://ji.dd.jimisaacs.com)
 */

kk.g2d.Vector2D = function(x, y, angle) {
  this.angle = angle;
  this.x = x;
  this.y = y;
  
  /** 
   * Move based on angle of trajectory and magnitude of distance
   * a - the angle to move in
   * m - how far to move 
   */
  this.move = function(a, m) {
    this.x += Math.cos(kk.g2d.Trig.radian(a)) * m;
    this.y += Math.sin(kk.g2d.Trig.radian(a)) * m;
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
    return this.angle = kk.g2d.Trig.getAngle(this, p);
  };
  
  /**
   * Get the distance from this instance to a given point
   * p - the geometric point 
   */
  this.distance = function(p) {
    return kk.g2d.Trig.getDistance(this, p);
  };
  
  /**
   * Get the distance without applying square root for comparison
   */
  this.comparableDistance = function(p) {
    return kk.g2d.Trig.getSquaredDistance(this, p);
  };
  
  /**
   * Returns a new vector with the same attributes as this
   */
  this.copy = function(){
    return new kk.g2d.Vector2D(this.x, this.y, this.angle);
  };
}