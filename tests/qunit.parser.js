/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
(function(){
  module('parser');
  
  // simple short hands
  var encode = io.Transport.prototype.encode
    , decode = io.Transport.prototype.decode;
  
  // Test the decoding of messages from the Socket.IO server
  test('decoding', function(){
    // Decode a single message
    var single = decode.call(this, '~m~5~m~abcde');
    equals(single.length, 1);
    equals(single[0], 'abcde');
    equals(typeof single[0], 'string');
    
    // Decode multiple messages
    var multiple = decode.call(this, '~m~5~m~abcde' + '~m~9~m~123456789');
    
    equals(multiple.length, 2);
    equals(multiple[0], 'abcde');
    equals(multiple[1], '123456789');
    equals(typeof multiple[0], 'string');
    equals(typeof multiple[1], 'string');
    
    // Decode a bad encoded message
    var bad = decode.call(this, '~m~5~m~abcde' + '~mffsdaasdfd9~m~1aaa23456789');
    
    equals(bad.length, 1);
    equals(bad[0], 'abcde');
    equals(bad[1], undefined);
  });
  
  // Test the encoding of messages for the Socket.IO server
  test('encoding', function(){
    equals(encode.call(this, ['abcde', '123456789']), '~m~5~m~abcde' + '~m~9~m~123456789');
    equals(encode.call(this, 'asdasdsad'), '~m~9~m~asdasdsad');
    equals(encode.call(this, {foo:'bar',bar:123,baz:[]}), '~m~35~m~~j~{"foo":"bar","bar":123,"baz":[]}')
    equals(encode.call(this, ''), '~m~0~m~');
    equals(encode.call(this, null), '~m~0~m~');
    
    // check function converstion..
    var fn = function(){console.log('pewpew')}
      , str = fn.toString();
      
    equals(encode.call(this, fn), '~m~' + str.length + '~m~' + str);
  });
  
  // Content interception, handle the ~j~ and ~h~ flags
  test('interception', function(){
    
    // We need to create a little stub to see if the onMessage dispatches the content correctly based
    // on the content of the messages.
    var stub = {
        // transports assume if there's no session id, the first message from the server is the sessionid
        sessionid:1
        
        // support heatbeart echos
      , onHeartbeat:function(beat){
          equals(beat, '1000');
        }
        
        // regular messages as dispatched to the base.onMessage function
      , base: {
          onMessage:function(obj){
            equals(obj.foo, 'bar');
            equals(obj.bar, 123);
            equals(Object.prototype.toString.call(obj.baz), '[object Array]');
            equals(obj.baz.length, 0);
          }
      }
    };
    
    io.Transport.prototype.onMessage.call(stub, '~h~1000');
    io.Transport.prototype.onMessage.call(stub, '~j~{"foo":"bar","bar":123,"baz":[]}');
    
    // overwrite the stub, and handle a regular message
    stub.base.onMessage = function(msg){ equals(msg,'pewpew'); };
    io.Transport.prototype.onMessage.call(stub, 'pewpew');
    
    // even if the message looks like json, it's not prefixed with ~j~, so it should be a string
    stub.base.onMessage = function(msg){ equals(msg,'{"foo":"bar","bar":123,"baz":[]}'); };
    io.Transport.prototype.onMessage.call(stub, '{"foo":"bar","bar":123,"baz":[]}');
  });
})();