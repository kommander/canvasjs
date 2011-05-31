/**
 * Sprite
 * The tiles are held in order from top left to bottom right,
 * and can be rendered directly to a context with get(tileNum)(context).
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.g2d.Sprite = kk.g2d.Vector2D.extend({
  
  init: function(image, tileWidth, tileHeight) {
    this._super.init(5, 5, 5);
    this._image = image;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
    this._createTiles();
  },
  
  //Private Attribbutes
  _tile: [],
  _image: null,
  _position: 0,
  _tileWidth: 0,
  _tileHeight: 0,
  
  //Public Attributes
  rotation: 0,
  
  /**
   * Create tiles
   */
  _createTiles: function() {
    var tileIndex = 0;
    for(var i = 0; i < this._image.height / this._tileHeight; i++) {
      for(var j = 0; j < this._image.width / this._tileWidth; j++) {
        this._tile[tileIndex] = eval('(function(context) { ' +
          'context.drawImage(this._image, ' + (j * this._tileWidth) + ', ' + (i * this._tileHeight) + ', ' + 
          this._tileWidth + ', ' + this._tileHeight + ', this.x, this.y, ' + this._tileWidth + ', ' + this._tileHeight + '); })').bind(this);
        tileIndex++;
      }
    }
  },
  
  /**
   * Jump to the next tile in order
   */
  next: function() {
    this._position = (++this._position < this._tile.length) || 0;
  },
  
  /**
   * Jump to the previous tile in order
   */
  prev: function() {
    this._position = (++_position > 0) || this._tile.length - 1;
  },
  
  /**
   * Get a specific tile
   */
  get: function(num) {
    return this._tile[num];
  },
  
  /**
   * Render the current tile to the context
   */
  tick: function(context, tickTimeDiff) {
    this.get(this._position)(context);
  },
  
  /**
   * Get the current position
   */
  position: function(num) {
    if(num != undefined)
      this._position = num;
    return this._position;
  },
  
  /**
   * Returns the number of tiles in the sprite
   */
  length: function(){
    return this._tile.length;
  }
});