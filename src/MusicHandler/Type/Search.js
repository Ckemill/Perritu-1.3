const api = process.env.YT_API;
const ytsr = require('youtube-search');
const { MessageEmbed } = require('discord.js');

module.exports.search = async function (client, target, user, type) {
    
    var opts = {
        maxResults: 1,
        key: api,
        type: type
    }

    const songArg = await ytsr(target, opts);
    const songInfo = songArg.results[0];

    const song = {
        id: songInfo.link.substring(32),
        title: songInfo.title,
        url: songInfo.link,
        img: songInfo.thumbnails.high.url || songInfo.thumbnails.default.url,
        author: songInfo.channelTitle,
        age: songInfo.publishedAt,
        user: user
    }

    const playEmbed = new MessageEmbed()
        .setColor('PURPLE')
        .setTitle('**Now playing:**')
        .setThumbnail(song.img)
        .setDescription(`**[${client.utils.formatTitle(song.title)}](${song.url})**\n**Author:** [${song.author}](${'perritu.net'})\n**Uploaded:** ${song.age}\n**Requested by:** ${song.user}`);

    return {
        song: song,
        msg: playEmbed
    }

}