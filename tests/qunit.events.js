/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
(function(){
  module('events');
  
  // used to handle connection errors so we can
  // still continue with our test suite
  function connectionError(message){
    return function(){
      ok(false, message || 'error');
      start();
    }
  }
  
  test('adding event listeners', function(){
    var socket = new io.Socket()
      , fn = function(){}
    
    // test api sugar
    equal(socket.on, socket.addEvent);
    equal(socket.addEvent, socket.addEventListener);
    equal(socket.on, socket.addListener);
    
    socket.on('foo', fn);
    equal(socket.events.foo[0], fn);
  });
  
  test('removing events', function(){
    var socket = new io.Socket()
      , fn = function(){}
    
    // test api sugar
    equal(socket.removeEvent, socket.removeEventListener);
    equal(socket.removeEvent, socket.removeListener);
    
    socket.on('foo', fn);
    socket.removeEvent('foo', fn);
    equal(socket.events.foo.length, 0);
  });
  
  test('emiting events', function(){
    var socket = new io.Socket()
      , calls = 0
      , fn = function(){
        calls++;
      };
    
    // test api sugar
    equal(socket.emit, socket.fire);
    
    socket.on('foo', fn);
    socket.emit('foo');
    socket.emit('foo');
    
    equal(calls, 2);
  });
  
  test('once', function(){
    var socket = new io.Socket()
      , calls = 0
      , fn = function(){
        calls++;
      };
    
    socket.once('foo', fn);
    socket.emit('foo');
    socket.emit('foo');
    
    equal(calls, 1);
  });
  
  // check for proper connections
  asyncTest('connect', function(){
    var socket = new io.Socket()
      , connectEvents = 0;
    
    // should be called when we are connected
    socket.connect(function(){
      connectEvents++;
    });
    
    socket.connect();
    
    // should be called when we are connected
    socket.on('connect', function(){
      connectEvents++;
      equal(socket.connected, true);
      equal(socket.connecting, false);
      equal(socket.reconnecting, false);
      
      // shut down the connection
      setTimeout(function(){ socket.disconnect(); }, 0);
    });
    
    socket.on('disconnect', function(){
      start();
      equal(connectEvents, 2);
    });
    
    // handle errors
    socket.on('error', connectionError());
    socket.on('connection_failed', connectionError('failed'));
  });
}());