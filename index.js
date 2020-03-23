// Environment variables
require('dotenv').config()
const DISCORD_KEY = process.env.DISCORD_KEY
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID

// External dependencies
const Discord = require('discord.js')
const bot = new Discord.Client()

// Parameter handlers
const queryMovie = require('./src/movies')
const helpMessage = require('./src/help')

const commands = { 
    "m": queryMovie,
    "h": _ => helpMessage,
}

bot.on('message', async (msg) => {
    if (msg.mentions.has(BOT_CLIENT_ID) ) {
        let call = msg.content.match(`<@!${BOT_CLIENT_ID}>(.*)`)[1].trim().split(/\s+/)
        let queryParameter = call.shift()
        let query = call.join(" ")
        console.info(`${msg.author.username} wants to look ${queryParameter} up, query: ${query}`)
        if (queryParameter in commands) {
            command = commands[queryParameter]
            let result = await command(query)
            msg.channel.send(result)
        } else {
            msg.channel.send(helpMessage)
        }
    }
})

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
})

bot.login(DISCORD_KEY)

process.on('exit', () => {
    bot.destroy()
})