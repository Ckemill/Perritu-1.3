const config = require('../config.json');
const Perritu = require('./Structures/Perritu');

const client = new Perritu(config);
client.start();