const express = require('express');
const packageJson = require('../../../package.json');
const api = express.Router();

// Version 1 API routes

// ###########################################
// Simple API endpoints

api.get('/ip', (req, res) => {
    const ipaddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip: ipaddr });
});

api.get('/whoami', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    res.json({
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: userAgent
    });
});

api.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
        result: {
            status: 'success'
        }
    })
});

api.get('/node', (req, res) => {
    res.json({
        hostname: process.env.HOSTNAME,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

module.exports = api;
