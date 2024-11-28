const express = require('express');
const router = express.Router();

// Version 1 API routes
const v1Router = express.Router();
v1Router.get('/example', (req, res) => {
    res.json({
        message: 'This is an example endpoint for version 1',
        timestamp: res.locals.timestamp,
        additionalInfo: res.locals.additionalInfo
    });
});

// Mount versioned routes
router.use('/dev', require('./dev'));
router.use('/v1', require('./v1'));

// Response Handler & Middleware for all routes
router.use((req, res) => {
    res.toolbox.header = 'Some additional information';
    res.toolbox.timestamp = new Date().toISOString();
    res.toolbox.server = $env.SERVER_NAME;
    res.toolbox.docs = `https://toolbox.igsteven.com/docs/`;
    

    
});


module.exports = router;