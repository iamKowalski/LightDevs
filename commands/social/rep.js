const { Command, LightEmbed } = require('../../utils')
const moment = require('moment')
require('moment-duration-format')
moment.locale('pt-BR')

module.exports = class Rep extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['+rep']
        this.category = 'Social'
    }

    async run(message, args) {
        let user = message.mentions.users.first()
        if (!user || user.bot) return message.channel.send(`Mencione um usuário para dar pontos de reputação!`)
        const userMDocument = message.guild && this.client.database && await this.client.database.users.get(user.id, 'rep')
        const userAuthDocument = message.guild && this.client.database && await this.client.database.users.get(message.author.id, 'lastRep')
        var tempo = moment.duration.format([moment.duration((parseInt(userAuthDocument.lastRep) + 86400000) - Date.now())], 'hh:mm:ss')

        if ((parseInt(userAuthDocument.lastRep) + 86400000) <= (Date.now())) {
            userMDocument.rep += 1
            userAuthDocument.lastRep = Date.now()
            Promise.all([
                userAuthDocument.save(),
                userMDocument.save()
            ])
            message.channel.send(`Você deu \`+1\` ponto de reputação para ${user}!`)
        } else {
            message.channel.send(`Espere mais \`${tempo}\` para poder dar outro ponto de reputação!`)
        }


    }
}