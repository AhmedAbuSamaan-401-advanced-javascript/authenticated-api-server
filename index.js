'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./src/server.js');
const MONGOOSE_URI = 'mongodb://localhost:27017/class-08';

mongoose.connect(process.env.MONGODB_URI || MONGOOSE_URI , {
  useNewUrlParser: true,
  useCreateIndex:true,
  useUnifiedTopology: true
});

server.start(process.env.PORT);