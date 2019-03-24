module.exports = async function onReady() {
    setInterval(async () => {
        let status = [`Ajudando ${this.users.size} membros! | l!ajuda`, 'lightdevs.tk | l!ajuda']
        let random = status[Math.floor(Math.random() * status.length)]
        this.user.setActivity(random)
    }, 9000)
}