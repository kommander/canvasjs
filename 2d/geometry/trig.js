/**
 * Static Trigonometric Functions
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * License: GPL
 * 
 * Based on a AS3 implementation by jimisaacs (http://ji.dd.jimisaacs.com)
 */

var Trig = (function() {
  
  /**
   * Convert a degree to a radian 
   */
  this.radian = function(d) {
    return d * (Math.PI / 180);
  };
 
  /**
   * Convert a radian to a degree 
   */
  this.degree = function(r) {
    return r / (Math.PI / 180);
  };
 
  /**
   * Find the angle of trajectory from two given points 
   */
  this.getAngle = function(a, b) {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  };
 
  /**
   * Get the distance from two given points 
   */
  this.getDistance = function(a, b) {
    return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
  };
  
})();