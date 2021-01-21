const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['m', 'mutea', 'silencia', 'silenciar'],
            description: 'Mute members on same voice channel as you.',
            category: 'Utilities',
            usage: '<@user> [all]',
            botPerms: ['MUTE_MEMBERS'],
            guildOnly: true
        });
    }

    async run(message, args) {

        if (!args.length) return message.channel.send(`You can mute by tagging who you want to mute, or mute all with **${this.client.prefix}mute all**.\nExample: \`${this.client.prefix}mute @${message.author.username}\`.`);

        if (message.member.voice.channel) {
            
            if (args.length == '1' && message.member.permissions.has('MUTE_MEMBERS') && args.join().toLowerCase() == 'all' || args.length == '1' && message.member.permissions.has('MUTE_MEMBERS') && args.join().toLowerCase() == 'todos') {
                
                let voiceChannel = message.guild.channels.cache.get(message.member.voice.channel.id);
                const users = [];

                for (const [memberID, member] of voiceChannel.members) {
                    if (!member.voice.serverMute) {
                        member.voice.setMute(true);
                        users.push(member);
                    }
                }

                if (!users.length) return;

                message.channel.send(`Muting ${users.join(', ')}.`)
                    .then(msg => {
                        msg.delete({ timeout: 10000 });
                    });
            }

            else if (!message.mentions.members.first()) return message.reply(`you don't have permissions to mute users, but you iniciate a voting mute by tagging who you need to mute.** \n Example: \`${this.client.prefix}mute @${message.author.username}\``);

            else if (!message.member.permissions.has('MUTE_MEMBERS')) {

                const userCount = message.member.voice.channel.members.size;
                const porcent = Math.round((70 / 100) * userCount);

                if (message.mentions.members.first().id === message.author.id) return message.reply(`you can mute yourself...`);

                message.delete();

                const embed = new MessageEmbed()
                    .setColor('PURPLE')

                const users = [];

                message.mentions.members.forEach(async (user) => {

                    users.push(user);

                });

                if ((userCount-users.length) <= 1) return message.reply(`there's no enough members on the voice to mute this users.`);

                embed.setTitle(`Muting vote.`);
                embed.setDescription([
                    `\u200b`,
                    `${message.author} wants to mute ${this.client.utils.formatMentions(users)}.`,
                    `\u200b`
                ]);
                embed.setFooter(`The majority on the voice channel must vote for the mute to take effect.`);

                let vote = await message.channel.send(embed);

                await vote.react('👍');
                await vote.react('👎');

                const filter = (reaction, user) => {
                    return ['👍', '👎'].includes(reaction.emoji.name) && !users.includes(user);
                };

                vote.awaitReactions(filter, { max: userCount-users.length, time: 12000, errors: ['time'] })
                    .then(collected => {

                        

                        const message = collected.first().message;

                        const muted = new MessageEmbed()
                            .setTitle('Muting vote.')
                            .setDescription([
                                `\u200b`,
                                `${this.client.utils.formatMentions(users)} ${this.client.utils.formatQuantity(users.length)} muted.`,
                                `\u200b`
                            ])
                            .setFooter(`10 minutes muted time.`);

                        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                        message.edit(muted);

                        users.forEach(async (member) => {

                            member.voice.setMute(true);

                            setTimeout(function () {

                                member.voice.setMute(false);

                            }, 600000);

                        });


                    })
                    .catch(collected => {

                        console.log(collected);

                        const message = collected.first().message;

                        const emb = new MessageEmbed(message.embeds[0]).setDescription([
                            `\u200b`,
                            `No enough votes to mute ${this.client.utils.formatMentions(users)}.`,
                            `\u200b`
                        ]);

                        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                        return message.edit(emb);
                    });

            }

            else {

                message.mentions.members.forEach(async (user) => {

                    if (!user) return message.reply(`mention who you want to mute.`);
                    if (user.id === message.author.id) return message.reply(`you can mute yourself...`);
                    if (user.voice.serverMute) return message.reply(`${user} was already mute.`);
                    if (user.voice.selfMute) return message.reply(`${user} is already self muted.`);
                    if (!user.voice.channel) return message.reply(`${user} isn't on a voice channel.`);
                    if (user.voice.channel.id != message.member.voice.channel.id) return message.reply(`${user} isn't in the same voice channel as you.\nYou can only mute member in the same voice channel as you.`);
                    
                    user.voice.setMute(true);
    
                    await message.channel.send(`${user}, ${message.author} just mute you.`).then(msg => {msg.delete({ timeout: 10000 })});
                });

            }
            
        }
        else {
            message.reply(`you aren't in any voice channel.`);
        }

    }

};