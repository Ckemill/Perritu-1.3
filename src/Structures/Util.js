const path = require('path');
const Event = require('./Event');
const Command = require('./Command');
const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = class util {

    constructor(client) {

        this.client = client;

    }

    setQueue (guild, object) {
        this.client.queue.set(guild, object);
    }

    getQueue (guild) {
        return this.client.queue.get(guild);
    }

    delQueue (guild) {
        this.client.queue.delete(guild);
    }

    isClass (input) {
        return typeof input === 'function' &&
        typeof input.prototype == 'object' &&
        input.toString().substring(0, 5) === 'class';
    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    trimArray (arr, maxLen = 10) {

        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }

        return arr;

    }

    removeDuplicates (arr) {
        return [...new Set(arr)];
    }

    checkOwner (target) {
        return this.client.owners.includes(target);
    }

    comparePerms(member, target) {
        return member.roles.highest.position < target.roles.highest.position
    }

    capitalise(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    formatMentions (arr) {

        if (arr.length == 2) {
            return arr.join(' and ');
        }

        if (arr.length >= 3) {
            
            let users = [];
            let counter = 1;

            users.push(arr[0]);

            while (counter < arr.length-1){

                users.push(`, ${arr[counter]}`);
                counter++;

            }

            users.push(` and ${arr[arr.length-1]}`);

            return users.join(' ');
        }

        else {

            return arr;

        }

    }

    formatPerms (perm) {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/_/g, ' ')
            .replace(/Guild/g, 'Server')
            .replace(/Use Vad/g, 'Use voice Activity');
    }

    formatTitle(title) {
        return title
            .replace(/&#39;/g, `'`)
            .replace(/�/g, `<3`)
            .replace(/🖤/g, `<3`)
            .replace(/&quot;/g, `"`)
    }

    formatQuantity(quantity) {

        if (quantity > 1) return 'were';

        else return 'was';

    }

    formatArray(array, type = 'conjunction') {
        return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
    }

    async loadCommands() {
        return glob(`${this.directory}commands/**/*.js`).then(commands => {
            for (const commandFile of commands){
                delete require.cache[commandFile];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`The ${name} command doesn't export a class.`);
                const command = new File(this.client, name.toLocaleLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`The command ${name} doesn't belong to commands.`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
            }
        });
    }

    async loadEvents() {
        return glob(`${this.directory}events/**/*.js`).then(events => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class.`);
                const event = new File(this.client, name);
                if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in the Events directory.`);
                this.client.events.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.run(...args));
            }
        })
    }

}