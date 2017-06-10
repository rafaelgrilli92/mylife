'use strict'

const scribe = require('scribe-js')(); // logger

/** GLOBALS */
global._ = require('lodash/core');
global.log = process.console;

const express = require('express'),
http = require('http'),
fs = require('fs'),
bodyParser = require('body-parser'),
cors = require('cors');

// DB Setup
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:mylife/mylife', function(err) {
    if(err) return log.error('db', 'connection failed', err);
    log.log('db', 'connected successfully');
})

// app Setup
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(scribe.express.logger());
app.use('/logs', scribe.webPanel());

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) === '.js') {
      var route = require('./controllers/' + file);
      route.controller(app);
  }
});

// server setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, function() {
    log.log('sv', 'listening on port:', port);
})
