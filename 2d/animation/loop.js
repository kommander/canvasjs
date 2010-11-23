function Loop(canvas)
{
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.running = false;
  
  this.tickTime = 0;
  this.tickDuration = 0;
  
  this.startTime = 0;
  this.statusTime = new Date().getTime();
  this.frameRate = 30;
  this.droppedFrames = 0;
  this.renderedFrames = 0;
  this.frameCounter = 0;
  this.fps = 0;
  this.originalFont = this.context.font;
  this.infoFont = '800 12px Helvetica, Arial, sans-serif';
  this.tickInterval = null;
  
  this.showInfo = true;
  
  this.objects = [];
  
  this.add = function(object){
    this.objects.push(object);
  }
  
  this.tick = function(){
    if(!this.running)
      return;
    
    this.tickTime = new Date().getTime();
    
    if(this.tickTime - this.statusTime >= 1000)
    {
      this.fps = Math.floor(this.frameCounter / (this.tickTime - this.statusTime) * 1000);
      this.renderedFrames += this.frameCounter;
      this.frameCounter = 0;
      this.statusTime = this.tickTime;
      
    }
    
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(k in this.objects)
    {
      if(this.objects[k].visible !== false)
      {
        if(this.objects[k]['animate'] != undefined)
          this.objects[k].animate();
        if(this.objects[k]['draw'] != undefined)
          this.objects[k].draw(this.context);
      }
    }
    
    if(this.showInfo)
    {
      this.drawInfo();
    }
    
    this.frameCounter++;
  }
  
  this.start = function(){
    this.startTime = new Date().getTime();
    this.frameCounter = 0;
    this.running = true;
    var self = this;
    if(this.tickInterval == null)
      this.tickInterval = setInterval(function(){ self.tick(); }, Math.floor(1000 / this.frameRate));
  }
  
  this.drawInfo = function()
  {
    this.originalFont = this.context.font
    this.context.font = this.infoFont;
    this.context.fillStyle = '#009999';
    var runtime = new Date().getTime() - this.startTime;
    var infoString = this.objects.length + ' Objects ';
    infoString += Math.floor(runtime / 60000) + 'min. ' + Math.floor(runtime % 60000 / 1000) + ' sec. ';
    infoString += this.fps + ' FPS';
    var metrics = this.context.measureText(infoString);
    this.context.fillText(infoString, this.canvas.width - metrics.width - 5, 10);
    this.context.font = this.originalFont;
  }
  
  this.stop = function(){
    this.running = false;
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }
}