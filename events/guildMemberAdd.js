const LightEmbed = require('../utils/LightEmbed')
module.exports = async function onGuildMemberAdd(member) {
    const emojifyNumber = n => `${n}`.split('').map(d => d + '\u20E3').join('')
    if (member.guild.id === process.env.BOT_GUILD) {
        let channel = member.guild.channels.get(process.env.JOIN_CHANNEL)
        channel.setTopic(`Estamos agora com um total de ${emojifyNumber(member.guild.memberCount)} membros!`)
        const embed = new LightEmbed(member.user)
        channel.send(embed.setDescription(`${member.user.username} entrou no servidor!\n**ID:**\n\`${member.id}\`\n\nAgora temos __\`${channel.guild.memberCount}\`__ membros!`).setThumbnail(member.user.displayAvatarURL))
    }
}