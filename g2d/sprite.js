/**
 * Sprite
 * The tiles are held in order from top left to bottom right,
 * and can be rendered directly to a context with get(tileNum)(context).
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.Sprite = function(image, tileWidth, tileHeight) {
  kk.extend(this, new kk.g2d.Vector2D(0, 0, 0));
  
  var __ = this,
  _tile = [],
  _image = image,
  _position = 0,
  _tileWidth = tileWidth,
  _tileHeight = tileHeight;
  
  //Create tiles
  var tileIndex = 0;
  for(var i = 0; i < image.height / tileHeight; i++) {
    for(var j = 0; j < image.width / tileWidth; j++) {
      _tile[tileIndex] = eval('(function(context) { ' +
        'context.drawImage(_image, ' + j * tileWidth + ', ' + i * tileHeight + ', ' + 
        _tileWidth + ', ' + _tileHeight + ', __.x, __.y, ' + _tileWidth + ', ' + _tileHeight + '); })');
      tileIndex++;
    }
  }
  
  __.rotation = 0;
  
  /**
   * Jump to the next tile in order
   */
  __.next = function() {
    _position = (++_position < _tile.length) || 0;
  };
  
  /**
   * Jump to the previous tile in order
   */
  __.prev = function() {
    _position = (++_position > 0) || _tile.length - 1;
  };
  
  /**
   * Get a specific tile
   */
  __.get = function(num) {
    return _tile[num];
  };
  
  /**
   * Render the current tile to the context
   */
  __.tick = function(context, tickTimeDiff) {
    __.get(_position)(context);
  };
  
  /**
   * Get the current position
   */
  __.position = function(num) {
    if(num != undefined)
      _position = num;
    return _position;
  };
  
  /**
   * Returns the number of tiles in the sprite
   */
  __.length = function(){
    return _tile.length;
  };
};