const Event = require('../../Structures/Event');
const { pause } = require('../../MusicHandler/Functions/Pause');

module.exports = class extends Event {

    run(reaction, user) {

        if (user.bot) return;

        const emoji = reaction._emoji;
        const message = reaction.message;
        var voiceChannel = message.member.voice.channel;
        const serverQueue = this.client.utils.getQueue(message.guild.id);

        if (!serverQueue) return;

        if (serverQueue.reaction.id === message.id) {

            if (voiceChannel != serverQueue.voiceChannel) return message.channel.send(`${user}, you're not on my voice channel.`);

            else if (!serverQueue.dispatcher) return message.channel.send(`${user}, I'm not playing anything.`);

            else {

                if (emoji.name == '⏯') return pause(this.client, message, user);

            }

        }

    }
}