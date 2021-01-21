const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            aliases: ['ayuda', '?', 'command', 'commands', 'comando', 'comandos'],
            description: 'Shows info of all commands.',
            category: 'Utilities',
            usage: '[command]'
        });
    }

    async run(message, [command]) {
        const embed = new MessageEmbed()
            .setColor('PURPLE')
        
        if (command) {
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

            if (!cmd) return message.channel.send(`\`${command}\` invalid command.`);

            embed.setTitle(`Help for ${this.client.utils.capitalise(cmd.name)} command:`);
            embed.setDescription([
                `**❯ Alises: ** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
                `**❯ Desciption: ** ${cmd.description}`,
                `**❯ Category: ** ${cmd.category}.`,
                `**❯ Example: ** \`${cmd.usage}\``,
                `**❯ Info: **\`<>\` mandatory, \`[]\` optional.`
            ]);

            return message.channel.send(embed);
        }

        else {
            embed.setAuthor(`Commands for ${message.guild.name}:`)
            embed.setDescription([
                `Prefix on this server: \`${this.client.prefix}\``
            ]);

            let categories;
            if (!this.client.owners.includes(message.author.id)) {
                categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
            }
            else {
                categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
            }

            for (const category of categories) {
                embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd => 
                    cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
            }
            embed.addField("\u200b",`_type **${this.client.prefix}help \`command-name\`** or visit **[my website](http://perritu.net/)** to get more info._`);

            return message.channel.send(embed);

        }

    }

}