/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */
var http = require('http')
  , io = require('socket.io')
  , fs = require('fs')
  , url = require('url')
  , jade = require('jade');

// fetch all valid qunit tests
var tests = fs.readdirSync(__dirname).filter(function filter(file){
  return /^qunit.(?!server)/g.test(file);
});

// a poor mans mime type lib
var mime = {
    js: 'text/javascript'
  , html: 'text/html'
  , css: 'text/css'
};

// the test suite server
var server = http.createServer(function server (req, res){
  var extension = req.url.split('.');
  extension = extension[extension.length - 1] || 'html';
  
  // pick the correct socket.io build, the development build
  if (req.url == '/socket.io.js'){
    return serve('/../socket.io.js',extension, req, res);
  }
  
  // start serving files 'n' stuff
  if (['js', 'css'].indexOf(extension) >= 0){
    return serve(req.url, extension, req, res);
  }
  
  // render tmpl
  if (req.url == '/'){
    return jade.renderFile(
      __dirname + '/index.html'
      , {
        locals: { 
          tests: tests
        }
      }
      , function render (err, contents){
        if (err) return error(res, err);
        
        // 200, no caching tricks
        res.writeHead(200, {'Content-Type': mime[extension]});
        res.end(contents);
      }
    )
  }
  
  // no path matches, die
  error(res, 'fail');
});

// simple file serving
function serve(path, type, req, res){
  fs.readFile(__dirname + path, function readfile (err, contents){
    if (err) return error(res, err);
    
    // 200, no caching tricks
    res.writeHead(200, {'Content-Type': mime[type]});
    res.end(contents);
  });
};

// 404s
function error (res, err){
  res.writeHead(404);
  res.end(err.toString());
};

// create a simple socket.io based echo server
function setup(socket){
  socket.on('connect', function connect (client){
    client.on('message', function message (data){
      // echo, echo
      if (data.echo) return client.send(data.echo);
      
      // note, you should no do this in production
      if (data.compile) return client.send((new Function(data.compile).call(this, client, data)));
    });
  });
};

// start listening to the server
server.listen(8080);
setup(io.listen(server));