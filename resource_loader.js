/**
 * ResourceLoader
 *
 * Copyright 2011 Sebastian Herrlinger
 */
kk.ResourceLoader = function(){
  
  var _resourceNames = {},
  _resources = [],
  _counter = 0,
  _events = {
    allLoaded: function(){},
    loaded: function(){},
    error: null,
    update: function(){}
  },
  
  /**
   * Internally handles the loaded and error event of a resource
   */
  _evtHandler = function(resource, evt) {
    _counter++;
    _events['update'](_counter);
    if(evt.type == 'load') {
      resource.state = 'loaded';
      _events['loaded'](resource, _counter);
      if(typeof(resource.loaded) == 'function') {
        resource.loaded(resource, _counter);
      }
    } else {
      resource.state = evt.type;
      if(typeof(_events['error']) == 'function')
        _events['error'](resource, evt);
      else
        throw new Error('Unhandled ResourceLoader error!');
    }
         
    if(_counter == _resources.length){
      _events['allLoaded'](_counter);
    }
  },
  
  /**
   * Add a resource to the loader for loading
   */
  _add = function(resource, name) {
    if(typeof(resource) == 'object') {
      if(!resource.src) {
        throw new Error('A Resource needs a src attribute');
      }
      resource.name = name;
    }
    else if(typeof(resource) == 'string') {
      resource = {
        name: name,
        src: resource
      };
    } else {
      throw new Error('Unknown Resource type');
    }
    resource.state = null;
    resource.id = _resources.push(resource);
    if(resource.name) {
      _resourceNames[resource.name] = resource;
    }
  },
  
  /**
   * Start loading the resource
   */
  _load = function(resource) {
    
    //TODO: determine type an load accordingly
    resource.state = 'loading';
    resource.data = new Image();
    resource.data.onload = _evtHandler.bind(this, resource);
    resource.data.onerror = _evtHandler.bind(this, resource);
    resource.data.src = resource.src;
    
    return resource;
  };
  
  /**
   * Add an event listener for eiter loaded, allLoaded, update or error
   */
  this.listen = function(event, callback) {
    if(typeof(callback) == 'function'){
      _events[event] = callback;
    }
    return this;
  };
  
  /**
   * Public interface to add a resource to the loader
   */
  this.add = function(resources, name) {
    if(resources.constructor == Array) {
      for(var i = 0; i < resources.length; i++){
        _add(resources[i]);
      }
    }
    else if(typeof(resources) == 'object') {
      for(k in resources){
        _add(resources[k], k);
      }
    }
    else if(typeof(resources) == 'string') {
      _add(resources, name);
    } 
    else {
      throw new Error('Unknown resources type');
    }
    return this;
  };
  
  /**
   * Start loading not yet loaded resources.
   */
  this.load = function(force) {
    for(var i = 0; i < _resources.length; i++) {
      if(force === true || _resources[i].state === null)
        _load.call(this, _resources[i]);
    }
    return this;
  };
  
  this.getName = function(name) {
    return _resourceNames[name];
  };
  
  this.get = function(id) {
    return _resources[id];
  };
  
  this.size = function(){
    return _resources.length;
  };
};