/**
 * Static Trigonometric Functions
 *
 * Author: Sebastian Herrlinger <sebastian@formzoo.com>
 * License: GPL
 * 
 * Based on a AS3 implementation by jimisaacs (http://ji.dd.jimisaacs.com)
 */

kk.g2d.Trig = new (function() {
  this.PI180 = Math.PI / 180;
  
  /**
   * Convert a degree to a radian 
   */
  this.radian = function(d) {
    return d * this.PI180;
  };
 
  /**
   * Convert a radian to a degree 
   */
  this.degree = function(r) {
    return r / this.PI180;
  };
 
  /**
   * Find the angle of trajectory from two given points 
   */
  this.getAngle = function(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  };
 
  /**
   * Get the distance from two given points 
   */
  this.getDistance = function(a, b) {
    return Math.sqrt(this.getSquaredDistance(a, b));
  };
  
  /**
   * Get the distance without applying square root for comparison
   */
  this.getSquaredDistance = function(a, b) {
    return Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2);
  };
  
})();