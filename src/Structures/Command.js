const { Permissions } = require('discord.js');

module.exports = class Command {

    constructor(client, name, options = {}) {

        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description|| "No description provided.";
        this.category = options.category || "Doesn't have.";
        this.usage = `${this.client.prefix}${this.name} ${options.usage || ''}`.trim();
        this.userPerms = new Permissions(options.userPerms).freeze();
        this.botPerms = new Permissions(options.botPerms).freeze();
        this.guildOnly = options.guildOnly || false;
        this.ownerOnly = options.ownerOnly || false;
        this.nsfw = options.nsfw || false;
        this.args = options.args || false;

    }

    async run (message, args) {
        throw new Error(`The ${this.name} command doesn't send a run method.`);
    }

}