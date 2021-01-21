const ytdl = require('ytdl-core');

module.exports.play = function play(client, message) {
    
    let stream;
    const guild = message.guild.id;
    const serverQueue = client.utils.getQueue(guild);
    const textChannel = serverQueue.textChannel;
    var song = serverQueue.songs[0];

    if (!serverQueue.songs[0]) {
        
        serverQueue.voiceChannel.leave();
        client.utils.delQueue(guild);

        return textChannel.send(`Music has ended.`).then( msg => {
            msg.delete({ timeout: 60000 });
        });

    }

    if (!song.fb) {
        stream = ytdl(song.song.url, { filter: 'audioonly', quality: "highestaudio" });
    }

    if (song.fb) {
        stream = song.song.url;
    }

    textChannel.send(song.msg).then( sentMessage => {
        serverQueue.reaction = sentMessage;
        //sentMessage.react('⏮')
        sentMessage.react('⏹')
        sentMessage.react('⏯')
        sentMessage.react('⏭')
        //sentMessage.react('🔀')
        //sentMessage.react('🔁')
        .catch((err) => console.error(`One of the emojis failed to react. ${err}`))

        const connection = serverQueue.connection;
        connection.then( connection => {

            connection.voice.setSelfDeaf(true);

            const dispatcher = connection.play( stream, { volume: serverQueue.volume });
            serverQueue.dispatcher = dispatcher;

            dispatcher.on('finish', () => {

                serverQueue.songs.shift();
                sentMessage.delete();

                play(client, message);
            });
            dispatcher.on('error', error => {
                console.log(error);
            });
        });
    });

}