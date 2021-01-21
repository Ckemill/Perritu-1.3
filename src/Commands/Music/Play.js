const Command = require('../../Structures/Command');
const { search } = require('../../MusicHandler/Type/Search');
const { queue } = require('../../MusicHandler/Functions/Queue');
const { facebook } = require('../../MusicHandler/Type/Facebook');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['p', 'pon', 'toca', 'song', 'music', 'musica', 'reproduce'],
            description: 'Plays music or videos sound.',
            category: 'Music',
            usage: '<song name> <url>',
            guildOnly: true,
            botPerms: ['CONNECT', 'SPEAK']
        });
    }

    async run(message, args) {

        let song;
        const user = message.author;
        const targetSong = args.join(' ');
        const voiceChannel = message.member.voice.channel;
        const ytPlaylistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const ytVideoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const facebookPattern = /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/ig;

        if (message.author.bot) return;

        if (!voiceChannel) return message.reply(`you aren't in any voice channel.`).then(msg => {msg.delete({ timeout: 30000 })});

        if (this.client.utils.getQueue(message.guild.id)) {

            const serverQueue = this.client.utils.getQueue(message.guild.id)
            serverQueue.dispatcher.resume();
            serverQueue.paused = false;

            if (args.length < 1) return;

        }

        if (facebookPattern.test(args[0])){
            song = await facebook(this.client, args[0], user);
            return queue(this.client, song, message);
        }

        else {
            song = await search(this.client, targetSong, user, 'video');
            return queue(this.client, song, message);
        }

    }

}