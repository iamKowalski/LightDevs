module.exports = async function onGuildMemberRemove(member) {
    const emojifyNumber = n => `${n}`.split('').map(d => d + '\u20E3').join('')
    if (member.guild.id === process.env.BOT_GUILD) {
        let channel = member.guild.channels.get(process.env.JOIN_CHANNEL)
        channel.setTopic(`Estamos agora com um total de ${emojifyNumber(member.guild.memberCount)} membros!`)
    }
}