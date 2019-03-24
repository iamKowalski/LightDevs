const { Command, LightEmbed } = require('../../utils')

module.exports = class Help extends Command {
    constructor(name, client) {
        super(name, client) 

        this.category = 'Utilidade'
        this.aliases = ['ajuda', 'h', 'comandos']
    }

    async run(message, args) {
        const validCommands = this.client.commands.filter(c => !c.adminOnly)
        const embed = new LightEmbed(message.author)

        const categories = validCommands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i)
        categories
            .sort((a, b) => a.localeCompare(b))
            .forEach(category => {
                const commands = validCommands
                    .filter(c => c.category === category)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(c => `\`${c.name}\``).join('**, **')
                embed.addField(`${category}`, commands, false)
            })
        embed.setThumbnail(this.client.user.displayAvatarURL)

        message.channel.send(embed)
    }
}