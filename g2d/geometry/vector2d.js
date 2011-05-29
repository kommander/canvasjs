/**
 * A 2D Vector
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * License: GPL
 * 
 * Based on a AS3 implementation by jimisaacs (http://ji.dd.jimisaacs.com)
 */

kk.g2d.Vector2D = function(x, y, angle) {
  var __ = this;
  
  __.angle = angle;
  __.x = x;
  __.y = y;
  
  /** 
   * Move based on angle of trajectory and magnitude of distance
   * a - the angle to move in
   * m - how far to move 
   */
  __.move = function(a, m) {
    __.x += Math.cos(kk.g2d.Trig.radian(a)) * m;
    __.y += Math.sin(kk.g2d.Trig.radian(a)) * m;
  };
   
  /**
   * Move left based on the direction angle
   * m - how far to move 
   */
  __.left = function(m) {
    __.move(__.angle - 90, m);
  };
  
  /**
   * Move right based on the direction angle
   * m - how far to move 
   */
  __.right = function(m) {
    __.move(__.angle + 90, m);
  };
   
  /**
   * Move forward based on the direction angle
   * m - how far to move 
   */
  __.forward = function(m) {
    __.move(__.angle, m);
  };
  
  /**
   * Move backward based on the direction angle
   * m - how far to move 
   */
  __.backward = function(m) {
    __.move(__.angle - 180, m);
  };
  
  /**
   * Set angle to face the given point
   * p - the geometric point 
   */
  __.angleTo = function(p) {
    return __.angle = kk.g2d.Trig.getAngle(__, p);
  };
  
  /**
   * Get the distance from __ instance to a given point
   * p - the geometric point 
   */
  __.distance = function(p) {
    return kk.g2d.Trig.getDistance(__, p);
  };
  
  /**
   * Get the distance without applying square root for comparison
   */
  __.comparableDistance = function(p) {
    return kk.g2d.Trig.getSquaredDistance(__, p);
  };
  
  /**
   * Get the dot product of __ vector to another vector
   */
  __.dotProduct = function(other) {
    return __.x * other.x + __.y * other.y;
  };
  
  /**
   * Returns a new vector with the same attributes as __
   */
  __.copy = function(){
    return new kk.g2d.Vector2D(__.x, __.y, __.angle);
  };
};