"use strict";
/**
 * Module dependencies.
 */

var env = process.env.NODE_ENV || 'development';
var appEnv = process.env.ENVIRONMENT || 'development';
var fs = require('fs');

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , model = require("./model");

var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');
var Promise = require("bluebird");
var app = express();
var bcrypt = require('bcrypt');
app.set('port', process.env.PORT || 3000);
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(errorhandler())

app.use(function(req, res, next){
  if (( req.path == '/login.html' ) || ( req.path == '/login' ) || ( req.path.indexOf('.js') != -1 ) || ( req.path.indexOf('.css') != -1 )){
    next();
    return;
  }
  if ( req.cookies.rcjaCookie != null ){
    return Promise.try(() => {
      let cookie = req.cookies.rcjaCookie;
      return model.User.get(cookie)
    }).then((user) => {
      req.currentUser = user;
      return next();
    }).catch((err) => {
      res.redirect('login.html');
      return res.end();
    })
  }else{
    console.log('no cookie');
    res.redirect('login.html');
    return;
  }
});
if (appEnv === 'production') {
  app.use(serveStatic(path.join(__dirname, './dist'), {'index': ['index.html']}));
} else {
  app.use(serveStatic(path.join(__dirname, './app'), {'index': ['index.html']}));
}


var router = express.Router();
routes.mount(router);
app.use(router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

process.on('SIGINT', function() {
  process.exit();
});

process.on('SIGTERM', function() {
  process.exit();
});

