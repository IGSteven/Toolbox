const express = require('express');
const app = express.Router();
const path = require('path');

// API Version Routers
app.use('/v1', require(path.join(__basedir, 'src', 'api', 'v1')));

module.exports = app;