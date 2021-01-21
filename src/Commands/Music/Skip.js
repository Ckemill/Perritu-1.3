const Command = require('../../Structures/Command');
const { skip } = require('../../MusicHandler/Functions/Skip');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['next', 'sgt', 'siguiente', 'proximo', 'proxima'],
            description: 'Skips to next song/video on queue.',
            category: 'Music',
            guildOnly: true
        });
    }

    async run(message) {

        const user = message.author;

        return skip(this.client, message, user);

    }

};