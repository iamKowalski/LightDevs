const { Command, LightEmbed } = require('../../utils')
const { inspect } = require('util')

module.exports = class Eval extends Command {
    constructor(name, client) {
        super(name, client)
        this.adminOnly = true
        this.argsRequired = true
        this.examples = ['this.name']
        this.invalidArgsMessage = 'Digite um codigo'
        this.usage = '[code]'
    }

    async run(message, args) {
        let code = args.join(' ').replace(/^```(js|javascript ? \n )?|```$/gi, '')
        try {
            console.log(code)
            let msg = await this.result(eval(code))

            console.debug('\n' + msg)

            if (msg.length > 2000)
                msg = 'Mensagem muito longa, veja o console'

            message.channel.send(await this.clean(msg), { code: 'js' })
        } catch (error) {
            console.error(error)

            message.channel.send(error.message, { code: 'js' })
                .catch(console.error)
        }
    }

    async clean(text) {
        if (text instanceof Promise || (Boolean(text) && typeof text.then === 'function' && typeof text.catch === 'function'))
            text = await text
        if (typeof text !== 'string')
            text = inspect(text, { depth: 0, showHidden: false })

        text = text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)
        return text
    }

    async result(temp) {
        if (temp && temp[Symbol.toStringTag] === 'AsyncFunction')
            return this.result(await temp())
        if (temp && temp instanceof Promise)
            return this.result(await temp)

        return temp
    }
}
