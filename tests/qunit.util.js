/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
(function(){
	module('util');
	
	// test for a propper is Array test
	test('isArray', function(){
		var stub = {
		  '0': 0
		, '1': 1
		, '2': 2
		, length: 3
		};
		
	  ok(io.util.isArray([]));
	  ok(!io.util.isArray({}));
	  ok(!io.util.isArray('str'));
	  ok(!io.util.isArray(new Date()));
	  ok(!io.util.isArray(arguments));
	  ok(!io.util.isArray(stub));
	});
	
	// merge multiple objects
	test('merge', function(){
	  var start = {
	  			foo: 'bar'
	  		, bar: 'baz'
	  		}
	  	, duplicate = {
	  			foo: 'foo'
	  		, bar: 'bar'
	  		}
	  	, extra = {
	  			ping: 'pong'
	  		}
	  	, deep = {
	  			level1:{
	  				foo: 'bar'
	  			, level2: {
	  					foo: 'bar'
	  				,	level3:{
	  						foo: 'bar'
	  					, rescursive: deep
	  					}
	  				}
	  			}
	  		}
	  	, deeper = {
	  			foo: 'bar'
	  		, level1:{
	  				foo: 'baz'
	  			, level2: {
	  					foo: 'foo'
	  				,	level3:{
	  						foo: 'pewpew'
	  					, rescursive: deep
	  					}
	  				}
	  			}
	  		};
	  
	  io.util.merge(start,duplicate);
	  equal(start.foo, 'foo');
	  equal(start.bar, 'bar');
	  
	  io.util.merge(start,extra);
	  equal(start.ping, 'pong');
	  equal(start.foo, 'foo');
	  
	  io.util.merge(deep, deeper);
	  equal(deep.foo, 'bar');
	  equal(deep.level1.foo, 'baz');
	  equal(deep.level1.level2.foo, 'foo');
	  equal(deep.level1.level2.level3.foo, 'pewpew');
	});
	
	// Defer should take 100ms after the onload for webkit browsers.
	// All other browser should fire at inmeditly.
	test('defer', function(){
	  stop(1000);
	  var now = +new Date();
	  io.util.defer(function(){
	    ok(+new Date() - now >= ( io.util.webkit ? 100 : 0 ) );
	    start();
	  })
	});
	
	//Return the index of a item for given array
	test('indexOf', function(){
	  var data = ['socket',2,3,4,'socket',5,6,7,'io'];
	  equal(io.util.indexOf(data,'socket',1),4);
	  equal(io.util.indexOf(data,'socket',0),0);
	});
}());