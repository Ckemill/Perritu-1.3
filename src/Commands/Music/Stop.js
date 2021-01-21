const Command = require('../../Structures/Command');
const { stop } = require('../../MusicHandler/Functions/Stop');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['leave', 'para', 'parar', 'salir', 'vete'],
            description: 'Stops playing and leave the voice channel.',
            category: 'Music',
            guildOnly: true
        });
    }

    async run(message) {

        const user = message.author;

        return stop(this.client, message, user);

    }

};
