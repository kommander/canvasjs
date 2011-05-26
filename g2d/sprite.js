/**
 * Sprite
 * The tiles are held in order from top left to bottom right,
 * and can be rendered directly to a context with get(tileNum)(context).
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.Sprite = function(image, tileWidth, tileHeight) {
  
  var _tile = [],
  _image = image,
  _position = 0,
  _tileWidth = tileWidth,
  _tileHeight = tileHeight;
  
  //Create tiles
  var tileIndex = 0;
  for(var i = 0; i < image.height / tileHeight; i++) {
    for(var j = 0; j < image.width / tileWidth; j++) {
      _tile[tileIndex] = (function(offsetX, offsetY, context) {
        context.drawImage(_image, offsetX, offsetY, _tileWidth, _tileHeight, this.x, this.y, _tileWidth, _tileHeight);
      }).bind(this, j * tileWidth, i * tileHeight);
      tileIndex++;
    }
  }
  
  //TODO: replace with Vector2D
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  
  /**
   * Jump to the next tile in order
   */
  this.next = function() {
    _position = (++_position < _tile.length) || 0;
  };
  
  /**
   * Jump to the previous tile in order
   */
  this.prev = function() {
    _position = (++_position > 0) || _tile.length - 1;
  };
  
  /**
   * Get a specific tile
   */
  this.get = function(num) {
    return _tile[num];
  };
  
  /**
   * Render the current tile to the context
   */
  this.tick = function(context, tickTimeDiff) {
    this.get(_position)(context);
  };
  
  /**
   * Get the current position
   */
  this.position = function(num) {
    if(num != undefined)
      _position = num;
    return _position;
  };
  
  /**
   * Returns the number of tiles in the sprite
   */
  this.length = function(){
    return _tile.length;
  };
};