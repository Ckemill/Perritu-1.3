module.exports.skip = function (client, message, user) {

    const voiceChannel = message.member.voice.channel;
    const serverQueue = client.utils.getQueue(message.guild.id);

    if (!voiceChannel) return message.channel.send(`${user}, you have to be on a voice channel.`);

    if (!serverQueue) return message.channel.send(`${user}, there's nothing to skip.`);

    serverQueue.dispatcher.end();

    return message.channel.send(`${user} skipped the music.`);

}