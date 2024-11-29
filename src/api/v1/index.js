const express = require('express');
const api = express.Router();
const path = require('path');

// Version 1 API routes
api.use('/ukdsl', require(path.join(__basedir, 'src', 'api' ,'v1', 'ukservers')));

// ###########################################
// Simple API endpoints

api.get('/ip', (req, res, next) => {
    const ipaddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.locals.apiresponse = {
        message: 'Your IP Address',
        result: ipaddr
    };
    next();
});

api.get('/whoami', (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    res.locals.apiresponse = {
        message: 'Who Am I?',
        result: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: userAgent
        }
    };
    next();
});

api.get('/ping', (req, res, next) => {
    res.locals.apiresponse = {
        message: 'pong',
        result: {
            status: 'success'
        }
    };
    next();
});

api.get('/node', (req, res, next) => {
    res.locals.apiresponse = {
        hostname: process.env.HOSTNAME,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    };
    next();
});

// Response Middleware to add headers and extra data
api.use((req, res) => {
    if (!res.locals.apiresponse) {
        res.locals.apiresponse = {
            message: 'Not Found',
            status: 404,
            result: {}
        }
    }

    if (!res.locals.apiresponse.status) {
        res.locals.apiresponse.status = 200;
    }
    responseStatus = res.locals.apiresponse.status || 200;

    // Add extra data to the response
    res.locals.apiresponse.timestamp = new Date().toISOString();

    res.header('X-Powered-By', 'IGSteven\'s Toolbox');
    res.status(responseStatus).json(res.locals.apiresponse);
});

module.exports = api;
