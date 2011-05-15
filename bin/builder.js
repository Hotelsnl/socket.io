/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
 
/**
 * Module dependencies.
 */

var fs = require('fs')
  , socket = require('../lib/io')
  , uglyfyParser = require('../lib/vendor/uglifyjs/lib/parse-js')
  , uglyfyAst = require('../lib/vendor/uglifyjs/lib/process');

/**
 * License headers.
 * @api private
 */
 
var template = '/*! Socket.IO.%ext% build:' + socket.io.version + ', %type%. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */\n'
  , development = template.replace('%type%', 'development').replace('%ext%', 'js')
  , production = template.replace('%type%', 'production').replace('%ext%', 'min.js');

/**
 * The modules that are required to create a base build of Socket.IO.
 *
 * @const
 * @type {Array}
 * @api private
 */
 
var base = [
    'io.js'
  , 'util.js'
  , 'transport.js'
  , 'socket.js'
  ];

/**
 * The available transports for Socket.IO. These are mapped as:
 * 
 *   - `key` the name of the transport
 *   - `value` the dependencies for the transport
 *
 * @const
 * @type {Object}
 * @api public
 */
 
 var baseTransports = {
    'websocket': ['transports/websocket.js']
  , 'flashsocket': [
      'transports/websocket.js'
    , 'vendor/web-socket-js/swfobject.js'
    , 'vendor/web-socket-js/web_socket.js'
    , 'transports/flashsocket.js'
    ]
  , 'htmlfile': ['transports/xhr.js', 'transports/htmlfile.js']
  , 'xhr-multipart': ['transports/xhr.js', 'transports/xhr-multipart.js']
  , 'xhr-polling': ['transports/xhr.js', 'transports/xhr-polling.js']
  , 'jsonp-polling': ['transports/xhr.js', 'transports/jsonp-polling.js']
  };

/**
 * Builds a custom Socket.IO distribution based on the transports that you need. You can configure the build to create a
 * development build or production build (minified).
 *
 * @param {Array} transports The transports that needs to be bundled.
 * @param {Object} [options] Options to configure the building process.
 * @param {Function} callback The argument is always the callback, because the options are.. optional:D.
 * @callback {String|Boolean} err An optional argument, if it exists than an error occurred during the build process.
 * @callback {String} result The result of the build process.
 * @api public
 */
 
var builder = module.exports = function(){
  var transports, options, callback, error
    , args = Array.prototype.slice.call(arguments,0)
    , settings = {
        minify: true
      , custom: []
      };
  
  // Fancy pancy argument support
  // this makes any pattern possible mainly because we require only one of each type
  args.forEach(function(arg){
    switch(Object.prototype.toString.call(arg).replace(/\[object\s(\w+)\]/gi , '$1' ).toLowerCase()){
      case 'array':
        return transports = arg;
      case 'object':
        return options = arg;
      case 'function':
        return callback = arg;
    }
  });
  
  // Add defaults
  options = options || {};
  transports = transports || Object.keys(baseTransports);
  
  // Merge the data
  for(var option in options) settings[option] = options[option];
  
  // Start creating a dependencies chain with all the required files for the custom Socket.IO bundle.
  var files = [];
  base.forEach(function(file){
    files.push(__dirname + '/../lib/' + file);
  });
  
  transports.forEach(function(transport){
    var dependencies = baseTransports[transport];
    if (!dependencies) return error = 'Unsupported transport `' + transport + '` supplied as argument.';
    
    // Add the files to the files list, but only if they are not added before
    dependencies.forEach(function(file){
      var path = __dirname + '/../lib/' + file;
      if (!~files.indexOf(path)) files.push(path);
    })
  });
  
  // check to see if the files tree compilation generated any errors.
  if (error) return callback(error);
  
  var results = {};
  files.forEach(function(file){
    fs.readFile(file, function(err, content){
      if (err) error = err;
      results[file] = content;
      
      // check if we are done yet, or not.. Just by checking the size of the result
      // object.
      if (Object.keys(results).length !== files.length) return;
      
      // we are done, did we error?
      if (error) return callback(error);
      
      // concatinate the file contents in order
      var code = development;
      files.forEach(function(file){
        code += results[file];
      });
      
      // check if we need to add custom code
      if (settings.custom.length){
        settigns.custom.forEach(function(content){
          code += content;
        })
      }
      
      // update the socket.io code with a list of the available transports
      code = code.replace(/['"]@@AVAILABLE-TRANSPORTS@@['"]/g, JSON.stringify(transports));
      
      // check if we need to process it any further
      if (settings.minify){
        var ast = uglyfyParser.parse(code);
        ast = uglyfyAst.ast_mangle(ast);
        ast = uglyfyAst.ast_squeeze(ast);
        
        code = production + uglyfyAst.gen_code(ast);
      }
      
      callback(error, code);
    })
  })
};

/**
 * Builder version is also the current client version
 * this way we don't have to do another include for the
 * clients version number and we can just include the builder.
 *
 * @type {String}
 * @api public
 */
 
builder.version = socket.io.version;

/**
 * A list of all build in transport types.
 *
 * @type {Object}
 * @api public
 */
 
builder.transports = baseTransports;

/**
 * Command line support, this allows us to generate builds without having
 * to load it as module.
 */
 
if (!module.parent){
  var args = process.argv.slice(2); // the first 2 are `node` and the path to this file, we don't need them
  
  // build a development build
  builder(args.length ? args : false, {minify:false},function(err, content){
    if (err) return console.error(err);
    
    fs.write(fs.openSync(__dirname + '/../socket.io.js', 'w'), content, 0, 'utf8');
    console.log('Successfully generated the development build: socket.io.js');
  });
  
  // and build a production build
  builder(args.length ? args : false, function(err, content){
    if (err) return console.error(err);
    
    fs.write(fs.openSync(__dirname + '/../socket.io.min.js', 'w'), content, 0, 'utf8');
    console.log('Successfully generated the production build: socket.io.min.js');
  });
}