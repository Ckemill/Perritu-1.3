const Event = require('../Structures/Event');

module.exports = class extends Event {

    constructor(...args) {
        
        super(...args, {
            once: true
        });

    }

    run() {

        console.log([
            `${this.client.user.username} is alive!`,
            `${this.client.commands.size} commands loaded.`,
            `${this.client.events.size} events loaded.`
        ].join(`\n`));

        this.client.user.setStatus('online');

        const activities = [
            `${this.client.guilds.cache.size} servers!`,
            `${this.client.channels.cache.size} channels!`,
            `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
        ];

        let i = 0;
        setInterval( () => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: 'LISTENING' }), 15000);
        
    }

}