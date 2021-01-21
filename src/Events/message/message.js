const Event = require('../../Structures/Event');

module.exports = class extends Event {

    run(message) {
        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

        //if (message.channel.type === 'dm' && !message.author.bot) return message.channel.send('hello');

        if (message.author.bot) return;

        if (message.content == 'help') return message.channel.send(`type **${this.client.prefix}help** or visit **http://perritu.net/** to get more info.`);

        if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

        const prefix = message.content.match(mentionRegexPrefix) ?
            message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

        if (!message.content.startsWith(prefix)) return;
            
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(cmd.toLocaleLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLocaleLowerCase()));
        if (command) {

            if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
                return message.reply(`Sorry, this command can only be used by my owner.`);
            }

            if (command.guildOnly && !message.guild) {
                return message.reply(`Sorry, this command can only be used in a discord server.`);
            }

            if (command.nfsw && !message.channel.nfsw) {
                return message.reply(`Sorry, this command can only be used on a nfsw channel.`);
            }

            if (command.args && !args.length) {
                return message.reply(`Sorry, this command requires arguments to function.\n\n**Usage:** ${command.usage ?
                command.usage : 'This command doesn\'t have an usage'}.`);
            }

            if (message.guild) {
                const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
                if (userPermCheck) {
                    const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
                    if (missing.length) {
                        return message.reply(`You are missing **${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}** permissions, you need them to use this command.`);
                    }
                }

                const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
                if (botPermCheck) {
                    const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
                    if (missing.length) {
                        return message.reply(`${this.client.user} is missing **${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}** permissions, ask an admin to add them to me.`);
                    }
                }
            }
            
            command.run(message, args);
        }
    }
}