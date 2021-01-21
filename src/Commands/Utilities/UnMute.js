const ms = require('ms');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['um', 'desmutea', 'desilencia', 'desilenciar'],
            description: 'Quita el silencio a usuarios en llamada.',
            category: 'Utilities',
            usage: '<@user> [all]',
            userPerms: ['MUTE_MEMBERS'],
            botPerms: ['MUTE_MEMBERS'],
            guildOnly: true
        });
    }

    async run(message, args) {

        if (!args.length) {
            if (!message.member.voice.serverMute) return message.reply(`you're already unmute.`);
            message.member.voice.setMute(false);
            return message.reply(`now you're unmuted.`).then(msg => {msg.delete({ timeout: 10000 })});
        }

        if (message.member.voice.channel) {
            if (args.length == '1' && args.join().toLowerCase() == 'all' || args.length == '1' && args.join().toLowerCase() == 'todos') {
                let voiceChannel = message.guild.channels.cache.get(message.member.voice.channel.id);
                const users = [];

                for (const [memberID, member] of voiceChannel.members) {
                    if(member.voice.serverMute){
                        member.voice.setMute(false);
                        users.push(member);
                    }
                }

                if (!users.length) return;

                message.channel.send(`Unmuting ${users.join(', ')}.`)
                    .then(msg => {msg.delete({ timeout: 10000 })});
            }

            if (args.length >= 1 && !message.mentions.members.first() && args.join().toLowerCase() != 'all') {
                return message.channel.send(`To unmute yourself just type **${this.client.prefix}unmute**.\nYou can unmute tagging to who or mute all with **${this.client.prefix}unmute all**.\nExample: \`${this.client.prefix}unmute @${message.author.username}\`.`);
            }

            message.mentions.members.forEach(async (user) => {

                if (!user) return message.reply(`mention who you want to unmute.`);
                if (user.id === message.author.id) return message.reply(`to unmute yourself don't mention no one.`);
                if (!user.voice.serverMute && user.voice.selfMute) return message.reply(`${user} is self muted, I can't unmute him.`);
                if (!user.voice.serverMute) return message.reply(`${user} was already unmute.`);
                if (!user.voice.channel) return message.reply(`${user} isn't on a voice channel.`);
                if (user.voice.channel.id != message.member.voice.channel.id) return message.reply(`${user} isn't in the same voice channel as you.\nYou can only unmute member in the same voice channel as you.`);

                user.voice.setMute(false);

                await message.channel.send(`${user}, ${message.author} just unmute you.`).then(msg => {msg.delete({ timeout: 10000 })});

            });
        }
        else {
            message.reply(`you aren't in any voice channel.`);
        }

    }
}
