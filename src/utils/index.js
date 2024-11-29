const { config } = require('process');
const axios = require('axios');

const utils = {
    int2ip(ipInt) {
        return ((ipInt >>> 24) + '.' + (ipInt >> 16 & 255) + '.' + (ipInt >> 8 & 255) + '.' + (ipInt & 255));
    },

    ip2int(ip) {
        return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
    },

    id2ipmi(id, offset) {
        const sid = id.replace(/\D/g, '');
        const sref = `S-${sid}`;

        if (!sid || sid < 0 || sid > 9999) {
            return new Error('Invalid ID');
        }

        const ipminum = offset + parseInt(sid, 10);
        const ipmiip = this.int2ip(ipminum);

        return {
            ref: sref,
            id: sid,
            address: ipmiip,
        };
    },

    ipmi2id(ipmiip, offset) {
        const ipInt = this.ip2int(ipmiip);
        const id = ipInt - offset;

        if (id < 0 || id > 9999) {
            throw new Error('Invalid IPMI address');
        }

        return `S-${id}`;
    },

    async testLibrenms(selected = "default") {
        try {
            const response = await this.fetchLibrenms('devices', selected);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    },

    fetchLibrenms(endpoint, selected="default") {
        console.log(config.librenms);
        const librems = config.librenms[selected];
        if (!librems) throw new Error('Invalid Librenms configuration');
        if (!librems.enabled) throw new Error('Librenms configuration disabled');
        
        const requrl = config.librenms[selected].url + endpoint;
        const headers = {
            'X-Auth-Token': config.librenms[selected].apiKey,
            'Content-Type': 'application/json',
        };

        return axios.get(requrl, { headers }).then(response => response.data);
    }


};

module.exports = utils;
