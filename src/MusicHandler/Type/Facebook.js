const fb = require('fb-video-downloader');
const { MessageEmbed } = require('discord.js');

module.exports.facebook = async function (client, target, user) {

    const video = await fb.getInfo(target);

    if (!video.thumb) return 'live';

    if (!video.download.sd || video.error) return false;

    const song = {
        title: video.title,
        url: video.download.hd || video.download.sd,
        img: video.thumb,
        user: user
    };

    const playEmbed = new MessageEmbed()
        .setColor('PURPLE')
        .setTitle('**Now playing:**')
        .setThumbnail(song.img)
        .setDescription(`**[${client.utils.formatTitle(song.title)}](${song.url})**\n**Requested by:** ${song.user}`);

    return {
        song: song,
        msg: playEmbed,
        fb: true
    }

}