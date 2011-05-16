/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
(function(){
	module('constructor');
	
	// default setup
	test('defaults', function(){
	  var socket = new io.Socket();
	  equal(socket.host, document.domain);
	  equal(socket.connected, false);
	  equal(socket.connecting, false);
	  ok(!!socket.transport);
	});
	
	// http and portnumber as argument
	test('http & port number', function(){
		var socket = new io.Socket('http://example.com:1337');
		equal(socket.options.port, '1337');
		equal(socket.options.secure, false);
		equal(socket.host, 'http://example.com');
	});
	
	// https and portnumber as argument
	test('https && port number', function(){
		var socket = new io.Socket('https://example.com:1337');
		equal(socket.options.port, '1337');
		equal(socket.options.secure, true);
		equal(socket.host, 'https://example.com');
	});
	
	// port number only
	test('port only', function(){
		var socket = new io.Socket(':1337');
		equal(socket.options.port, '1337');
		equal(socket.options.secure, false);
		equal(socket.host, document.domain);
	});
	
	// test options support
	test('options only', function(){
		var socket = new io.Socket({secure: true});
		equal(socket.options.port, location.port || 80);
		equal(socket.options.secure, true);
		equal(socket.host, document.domain);
	});
}())