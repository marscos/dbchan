// Environment variables
require('dotenv').config()
const DISCORD_KEY = process.env.DISCORD_KEY
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID

// External dependencies
const Discord = require('discord.js')
const bot = new Discord.Client()

// Parameter handlers
const MoviesController = require('./controllers/MoviesController')
const AnimeController = require('./controllers/AnimeController')
const MiscController = require('./controllers/MiscController')
const WikiController = require('./controllers/WikiController')

const commands = {
  m: MoviesController.searchMovie,
  a: AnimeController.searchAnime,
  w: WikiController.searchWiki,
  h: MiscController.helpMessage
}

bot.on('message', async (msg) => {
  if (msg.mentions.has(BOT_CLIENT_ID)) {
    const call = msg.content.match(`<@!${BOT_CLIENT_ID}>(.*)`)[1].trim().split(/\s+/)
    const queryParameter = call.shift()
    const query = call.join(' ')
    console.info(`${msg.author.username} wants to look ${queryParameter} up, query: ${query}`)
    if (queryParameter in commands) {
      const command = commands[queryParameter]
      const result = await command(query)
      try {
        msg.channel.send(result)
      } catch (e) {
        msg.channel.send('Service Unavailable.')
      }
    } else {
      msg.channel.send(MiscController.helpMessage())
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
