module.exports.pause = function (client, message, user) {

    const voiceChannel = message.member.voice.channel;
    const serverQueue = client.utils.getQueue(message.guild.id);

    if (!voiceChannel) return message.channel.send(`you have to be on a voice channel.`);

    if (!serverQueue) return message.channel.send(`I'm not playing anything.`);

    if (serverQueue.paused) {

        serverQueue.dispatcher.resume();
        serverQueue.paused = false;

        return message.channel.send(`Current audio resumed by ${user}`);

    }
        
    if (!serverQueue.paused) {

        serverQueue.dispatcher.pause();
        serverQueue.paused = true;

        return message.channel.send(`Current audio paused by ${user}`);

    }

}