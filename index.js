'use strict'

const scribe = require('scribe-js')(); // logger
const console = process.console; // logger

const express = require('express'),
http = require('http'),
fs = require('fs'),
bodyParser = require('body-parser'),
cors = require('cors');

// DB Setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:mylife/mylife', function(err) {
    if(err) return console.error('db', 'connection failed', err);
    console.log('db', 'connected successfully');
})

// app Setup
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(scribe.express.logger());

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      var route = require('./controllers/' + file);
      route.controller(app);
  }
});

// server setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, function() {
    console.log('sv', 'listening on port:', port);
})
