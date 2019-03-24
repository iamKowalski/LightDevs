const { Command, LightEmbed } = require('../../utils')

module.exports = class AddBot extends Command {
    constructor(name, client) {
        super(name, client)

        this.category = 'Utilidade'
        this.aliases = ['adicionar', 'novobot', 'mandarpraca']
    }

    async run(message, args) {
        const embedAuth = new LightEmbed(message.author)
        const embedCha = new LightEmbed(message.author)

        let description = '';

        message.author.send(embedAuth.setDescription(`Olá, vamos começar?\nPara começar a enviar seu bot, coloque o **id** dele abaixo...   (\`1 minuto...\`)`))
            .then(msg => {
                message.channel.send(`${message.author.username}, olhe suas mensagens diretas!`)
                let collectorId = message.author.dmChannel.createMessageCollector(dm => dm, { time: 60000 })
                collectorId.on('collect', async collectedId => {
                    if (collectedId.author != message.author) return
                    if (collectedId.content.length > 0) {
                        collectorId.stop();
                        try {
                            let bot = await this.client.fetchUser(collectedId.content)
                            let botTag = `${bot.username}#${bot.discriminator}`
                            description += `${message.author.username}  acabou de enviar um bot (\`${botTag}\`)\n[Link para adicionar](https://discordapp.com/oauth2/authorize?client_id=${collectedId.content}&permissions=0&scope=bot)\n\n`
                            await msg.edit(embedAuth.setDescription(`Agora coloque o prefixo do seu bot...  (\`1 minuto...\`)`)).then(() => {
                                let collectorPrefix = message.author.dmChannel.createMessageCollector(dm => dm, { time: 60000 })
                                collectorPrefix.on('collect', async collectedPrefix => {
                                    if (collectedPrefix.author != message.author) return
                                    if (collectedPrefix.content.length > 0) {
                                        collectorPrefix.stop()
                                        description += `**Prefixo:**\n\`${collectedPrefix.content}\`\n\n`

                                        await msg.edit(embedAuth.setDescription(`Por ultimo queremos saber, qual a lib utilizada na produção do seu bot?    (\`1 minuto...\`)\n(\`Discord.js, Discord.py[rewrite], Discord.py, Discord.NET, Discord.Jda, Discord.go, Discord.rb\`)`)).then(() => {
                                            let collectorLib = message.author.dmChannel.createMessageCollector(dm => dm, { time: 60000 })
                                            collectorLib.on('collect', async collectedLib => {
                                                if (collectedLib.author != message.author) return
                                                if (collectedLib.content.length > 0) {
                                                    collectorLib.stop();
                                                    description += `**Lib:**\n\`${collectedLib.content}\``
                                                    embedCha.setDescription(description).setThumbnail(bot.avatarURL)
                                                    this.client.channels.get(process.env.PUBLIC_ADD_BOT_CHANNEL).send(`${message.author.username} acabou de enviar o bot \`${botTag}(${bot.id})\` para verificação!`)
                                                    this.client.channels.get(process.env.ADD_BOT_CHANNEL).send(embedCha).then(async () => {
                                                        msg.delete()
                                                        await message.author.send(embedAuth.setDescription(`Obrigado, o bot **${botTag}** foi enviado para nossa equipe avaliar!`)).then(last => {
                                                            last.delete(5000)
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    }
                                })
                            })
                        } catch (e) {
                            return msg.edit(embedAuth.setDescription(`O bot que você está tentando adicionar é inválido, cheque se pegou o ID correto e tente novamente!`)).then(() => msg.delete(5000))
                        }
                    }
                })
            })
            .catch(err => {
                message.channel.send('Ops, parece que suas `Mensagens Diretas (DM)` estão desativadas!')
            })
    }
}