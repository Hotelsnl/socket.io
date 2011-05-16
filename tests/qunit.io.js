/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
(function(){
	module('io');
	
	// io should export a valid version number
	test('version', function(){
	  ok(!!io.version);
	  ok(!!io.version.match(/([0-9]+)\.([0-9]+)\.([0-9]+)/));
	});
}())