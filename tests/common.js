/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
 
var vm = require('vm')
  , should = require('should');

/**
 * Generates evn variables for the vm so we can `emulate` a browser.
 * @returns {Object} evn variables
 */
 
exports.env = function env(){
  return {
    navigator:{useragent:''}
  , document:{}
  , window:{addEventListener:function(){}}
  }
};

/**
 * Executes a script in a browser like env and returns
 * the result
 *
 * @param {String} contents The script content
 * @returns {Object} The evaluated script.
 */
 
exports.execute = function execute(contents){
  var env = exports.env() 
    , script = vm.createScript(contents);
  
  // run the script with `browser like` globals
  script.runInNewContext(env);
  
  return env;
};