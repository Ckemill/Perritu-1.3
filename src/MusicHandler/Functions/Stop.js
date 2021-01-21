module.exports.stop = function (client, message, user) {

    const guild = message.guild.id
    const serverQueue = client.utils.getQueue(guild);
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send(`${user}, you have to be on a voice channel.`);

    if (!serverQueue) return message.channel.send(`${user}, I'm not playing anything.`);

    voiceChannel.leave();
    client.utils.delQueue(guild);

    if (serverQueue.reaction) {
        serverQueue.reaction.delete();
    }

    return message.channel.send(`${user} soped the music.`);

}