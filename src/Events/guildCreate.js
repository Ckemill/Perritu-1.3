const Event = require('../Structures/Event');

module.exports = class extends Event {

    run (guild) {

        const systemChannel = guild.systemChannel;

        if (!systemChannel) {

            return guild.channels.cache.find((c) => c.type === 'text' && c.permissionsFor(guild.me).has("SEND_MESSAGES")).send(`Mensaje de entrada.`);

        } else {

            return guild.systemChannel.send(`Mensaje de entrada.`);

        } 

    }

}