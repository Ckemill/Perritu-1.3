const Command = require('../../Structures/Command');
const { pause } = require('../../MusicHandler/Functions/Pause');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['pausar', 'pausa', 'ps', 'unresume', 'desreanudar'],
            description: 'Pause the audio.',
            category: 'Music',
            guildOnly: true
        });
    }

    async run(message) {

        const user = message.author;
        const serverQueue = this.client.utils.getQueue(message.guild.id);

        if (serverQueue && serverQueue.paused) return message.reply(`audio is already paused.`);

        return pause(this.client, message, user);

    }
};
