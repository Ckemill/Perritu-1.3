const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['vol', 'volumen'],
            description: 'Change the volume of the bot.',
            category: 'Music',
            usage: '<vol>',
            guildOnly: true,
            args: true
        });
    }

    async run(message, args) {

        const volume = (args.join(' ')*1);
        const voiceChannel = message.member.voice.channel;
        const serverQueue = this.client.utils.getQueue(message.guild.id);

        if (!voiceChannel) return message.reply(`you have to be on a voice channel.`);

        if (!serverQueue) return message.reply(`I'm not playing anything.`);

        if (!volume) return message.reply(`please type a number`);

        if (volume > 100 || volume < 1) return message.reply(`volume must be between **1** to **100**%`);

        const dispatcher = serverQueue.dispatcher;

        if (!dispatcher) return message.reply(`I can't change the volume yet.`);
        
        await dispatcher.setVolume(Math.min(volume / 50));
        serverQueue.volume = Math.min(volume / 50);
        message.channel.send(`**Volume:** \`${Math.round(dispatcher.volume*50)}%\``);

    }

};
