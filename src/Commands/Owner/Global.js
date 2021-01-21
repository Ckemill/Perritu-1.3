const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['changelog'],
            description: `Sends a message to each server.`,
            category: 'Owner',
            ownerOnly: true
        });
    }

    async run(message, args) {

        if (this.client.owners.includes(message.author.id)){
            try {
                this.client.guilds.cache.map((guild) => {

                    if (guild.systemChannel && guild.systemChannel.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
                        return guild.systemChannel.send(args.join(' '));
                    }

                    guild.channels.cache.map((c) => {
                        if (found === 0) {
                            if (c.type === 'text') {
                                if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true && c.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
                                    return c.send(args.join(' '));
                                }
                            }
                        }
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
        else {
            message.reply(`just my owner can use this command.`);
        }

    }

};
