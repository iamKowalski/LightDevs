const { Command, LightEmbed } = require('../../utils')

module.exports = class Rank extends Command {
    constructor(name, client) {
        super(name, client)

        this.category = 'Social'
        this.aliases = ['leaderboard', 'toprep']
    }

    async run(message, args) {
        const embed = new LightEmbed(message.author)
        const top = await this.leaderboard('rep')
        var numero = 1;
        let topUserThumb = top[0].user.displayAvatarURL
        embed.setDescription(top.map(u => `\`${numero++}º\` ${u.user.username} - ${u.rep} reps!`).join('\n'))
        embed.setThumbnail(topUserThumb)
        message.channel.send(embed)
    }

    async leaderboard(sortField, projection = sortField, size = 10) {
        const dbRes = await this.client.database.users.model.find({}, projection).sort({ [sortField]: -1 }).limit(size + 6)
        const top = dbRes.map(this.client.database.users.parse).filter(u => {
            u.user = this.client.users.get(u._id)
            return !!u.user
        })

        return top.splice(0, size)
    }
}