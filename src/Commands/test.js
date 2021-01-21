const Command = require('../Structures/Command');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['prueba'],
            description: 'Mute members on same voice channel as you.',
            category: 'Utilities',
            usage: '<@user> [all]',
            botPerms: ['MUTE_MEMBERS'],
            guildOnly: true
        });
    }

    async run(message, args) {

        const userCount = message.member.voice.channel.members.size;
        const porcent = Math.round((70 / 100) * userCount);

        if (!message.mentions.members.first()) return message.reply(`menciona a alguien`);

        message.delete();

        const embed = new MessageEmbed()
            .setColor('PURPLE')

        const users = [];

        message.mentions.members.forEach(async (user) => {

            users.push(user);

        });

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

                console.log(message.reactions)

                const exampleEmbed = new Discord.MessageEmbed()
                    .setTitle('Muting vote.')
                    .setDescription([
                        `\u200b`,
                        `${this.client.utils.formatMentions(users)} ${this.client.utils.formatQuantity(users.length)} muted.`,
                        `\u200b`
                    ])
                    .setFooter(`10 minutes muted time.`);

                message.edit(exampleEmbed);
                message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

            })
            .catch(collected => {

                const message = collected.first().message;

                const emb = new Discord.MessageEmbed(message.embeds[0]).setDescription([
                    `\u200b`,
                    `No enough votes to mute ${this.client.utils.formatMentions(users)}.`,
                    `\u200b`
                ]);
                message.edit(emb);
                message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            });

    }

};