const express = require('express');
const axios = require('axios');
const api = express.Router();

const ripeapiurl = "https://stat.ripe.net/data";

const handleApiResponse = (res, next, message, data) => {
    res.locals.apiresponse = {
        message,
        result: data
    };
    next();
};

const handleApiError = (res, next, message) => {
    res.locals.apiresponse = {
        message,
        status: 500,
        result: {}
    };
    next();
};

api.get('/abuse/:resource', (req, res, next) => {
    const resource = req.params.resource;
    const apiurl = `${ripeapiurl}/abuse-contact-finder/data.json?resource=${resource}`;
    axios.get(apiurl).then(response => {
        handleApiResponse(res, next, 'Abuse Contact Finder', {
            authoritative_rir: response.data.data.authoritative_rir,
            abuse_contact: response.data.data.abuse_contact
        });
    }).catch(() => {
        handleApiError(res, next, 'Error fetching Abuse Contact');
    });
});

api.get('/asn/:asn', (req, res, next) => {
    const asn = req.params.asn;
    const apiurl = `${ripeapiurl}/as-overview/data.json?resource=${asn}`;
    axios.get(apiurl).then(response => {
        handleApiResponse(res, next, 'ASN Overview', {
            as: response.data.data.resource,
            holder: response.data.data.holder,
            partent: response.data.data.block,
            announced: response.data.data.announced,
        });
    }).catch(() => {
        handleApiError(res, next, 'Error fetching ASN Overview');
    });
});

api.get('/asn/:asn/prefixes', (req, res, next) => {
    const asn = req.params.asn;
    const apiurl = `${ripeapiurl}/asn-prefixes/data.json?resource=${asn}`;
    axios.get(apiurl).then(response => {
        handleApiResponse(res, next, 'ASN Prefixes', response.data);
    }).catch(() => {
        handleApiError(res, next, 'Error fetching ASN Prefixes');
    });
});

api.get('/asn/:asn/neighbours', (req, res, next) => {
    const asn = req.params.asn;
    const apiurl = `${ripeapiurl}/asn-neighbours/data.json?resource=${asn}`;
    axios.get(apiurl).then(response => {
        handleApiResponse(res, next, 'ASN Neighbours', response.data);
    }).catch(() => {
        handleApiError(res, next, 'Error fetching ASN Neighbours');
    });
});

module.exports = api;
