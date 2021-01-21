const Command = require('../../Structures/Command');
const { pause } = require('../../MusicHandler/Functions/Pause');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['reanudar', 'reanuda' , 'unpause', 'despausar'],
            description: 'Resume the song/video.',
            category: 'Music',
            guildOnly: true
        });
    }

    async run(message) {

        const user = message.author;
        const serverQueue = this.client.utils.getQueue(message.guild.id);

        if (serverQueue && !serverQueue.paused) return message.reply(`audio is already playing.`);

        return pause(this.client, message, user);

    }
};
