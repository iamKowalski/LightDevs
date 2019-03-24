require('dotenv').config()

const Light_Devs = require('./Light')
const client = new Light_Devs()

client.login(process.env.TOKEN)
.then( () => {
    console.log('Ligado!')
})
.catch(err => {
    console.error(err)
})