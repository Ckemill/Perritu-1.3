const { play } = require('../Functions/Play');

module.exports.queue = function (client, song, message) {

    const voiceChannel = message.member.voice.channel;
    const serverQueue = client.utils.getQueue(message.guild.id);

    if (song.song == 'live') return message.reply(`I can't play live videos.`).then(msg => {msg.delete({ timeout: 30000 })});

    if (!song.song) return message.reply(`I didn't found that.`).then(msg => {msg.delete({ timeout: 30000 })});
        
    if (!serverQueue) {

        const queueObject = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            dispatcher: null,
            reaction: null,
            songs: [],
            volume: 0.5,
            playing: true,
            paused: false
        }

        try {

            var connection = voiceChannel.join();
            queueObject.connection = connection;

            queueObject.songs.push(song);
            client.utils.setQueue(message.guild.id, queueObject);

            return play(client, message);
                
        } catch (erro) {

            console.log(erro);
                
            return message.reply(`I don't have permissions to join your voice channel.`);

        }

    }

    else {

        serverQueue.songs.push(song);
        return message.channel.send(`**${client.utils.formatTitle(song.song.title)}** Has been added to the queue!, by: ${song.song.user}`);

    }

}