const express = require('express');
const axios = require('axios');
const api = express.Router();

api.get('/ipmi/', (req, res, next) => {
    res.locals.apiresponse = {
        message: 'No ID provided',
        status: 400,
        result: {}
    };
    next();
});

api.get('/ipmi/:id', (req, res, next) => {
    const result = utils.id2ipmi(req.params.id, 174000000);
    if (result instanceof Error) {
        res.locals.apiresponse = {
            message: result.message,
            status: 400,
            result: {}
        };
        next();
        return;
    }
    result.netmask = '255.255.0.0';
    result.gateway = '10.95.0.1';
    res.locals.apiresponse = {
        message: `IPMI 205 for ${result.ref}`,
        result: result
    };
    next();
});

api.get('/ipmi2id/:ipmiip', (req, res, next) => {
    const result = utils.ipmi2id(req.params.ipmiip, 174000000);
    if (result instanceof Error) {
        res.locals.apiresponse = {
            message: result.message,
            status: 400,
            result: {}
        };
        next();
        return;
    }
    res.locals.apiresponse = {
        message: `ID for IPMI 205 ${req.params.ipmiip}`,
        result: result
    };
    next();
});

module.exports = api;
