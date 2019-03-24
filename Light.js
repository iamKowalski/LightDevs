const { Client, Collection } = require('discord.js');
const Fs = require('fs')
const { MongoDB } = require('./database')

module.exports = class Light_Devs extends Client {
    constructor(options = {}) {
        super(options);

        this.commands = new Collection();

        this.initListeners('./events');
        this.initCommands('./commands')
        this.initializeDatabase(MongoDB, { useNewUrlParser: true })
    }

    initListeners(path) {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file;
                    if (file.endsWith('.js')) {
                        let Listener = require(filePath);
                        this.on(file.replace(/.js/g, ''), Listener);
                    }

                    let stats = Fs.lstatSync(filePath);
                    if (stats.isDirectory()) {
                        this.initListeners(filePath);
                    }
                } catch (error) {
                    console.error(error);
                }
            })
    }

    initCommands(path) {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file;
                    if (file.endsWith('.js')) {
                        const Command = require(filePath);
                        const commandName = file.replace(/.js/g, '').toLowerCase();
                        const command = new Command(commandName, this);
                        return this.commands.set(commandName, command);
                    } else if (Fs.lstatSync(filePath).isDirectory()) {
                        this.initCommands(filePath);
                    }
                } catch (error) {
                    console.error(error);
                }
            })
    }

    initializeDatabase(DBWrapper, options = {}) {
        this.database = new DBWrapper(options)
        this.database.connect()
            .then(() => console.log('( > ) | Conectado ao banco de dados!'))
            .catch(e => {
                console.log(e.message)
                this.database = null
            })
    }

}