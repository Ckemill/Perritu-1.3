const Util = require('./Util');
const { Client, Collection, Permissions } = require('discord.js');

module.exports = class Perritu extends Client {

    constructor(options = {}) {

        super({
            disableMentions: 'everyone'
        });

        this.validate(options);

        this.commands = new Collection();

        this.aliases = new Collection();

        this.events = new Collection();

        this.owners = options.owners;

        this.utils = new Util(this);

        this.queue = new Map();
    }

    validate(options) {

        if (typeof options !== 'object') throw new TypeError('Options should be type object.');

        if (!options.prefix) throw new Error('You haven\'t pass any default prefix.');
        if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be type string.');
        this.prefix = options.prefix;

        if (!options.defaultPerms) throw new Error('You should pass default permissions for Perritu.');
        this.defaultPerms = new Permissions(options.defaultPerms).freeze();

    }

    async start(token = process.env.BOT_TOKEN) {
        this.utils.loadCommands();
        this.utils.loadEvents();
        super.login(token);
    }

}