require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()

const TOKEN = process.env.TOKEN

bot.on('message', msg => {
    if (msg.mentions.has(process.env.BOT_CLIENT_ID) ) {
        let call = msg.content.match(`<@!${process.env.BOT_CLIENT_ID}>(.*)`)[1].trim().split(/\s+/)
        let command = call.shift()
        let param = call.join(" ")
        console.info(`${command}, ${param}`)
    }
})

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
})

bot.login(TOKEN)

process.on('exit', () => {
    bot.destroy()
})