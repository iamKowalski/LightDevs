module.exports = async function onMessage(message) {
    const botMention = message.guild ? message.guild.me.toString() : this.user.toString()
    const prefix = message.content.startsWith(botMention) ? `${botMention} ` : (message.content.startsWith(process.env.PREFIX) ? process.env.PREFIX : null)
    if (prefix) {
        const args = message.content.slice(prefix.length).trim().split(' ')
        const name = args.shift()
        const command = this.commands.find(command => command.name === name || command.aliases.includes(name))
        Object.defineProperties(message, {
            'prefix': { value: prefix },
            'command': { value: command }
        })
        if (command) {
            command.process(message, args)
        }
    }

}