const got = require('got')
const { MessageEmbed } = require('discord.js')
const API_URL = 'http://api.urbandictionary.com/v0/define' 

const getResultMessage = (definition) => {
  return new MessageEmbed()
    .setColor('#efff00')
    .setTitle(definition.word)
    .setURL(definition.permalink)
    .setDescription(definition.definition)
    .addFields(
      { name: 'Example', value: definition.example },
      { name: 'Author', value: definition.author, inline: true },
      { name: ':thumbsup:', value: definition.thumbs_up, inline: true },
      { name: ':thumbsdown:', value: definition.thumbs_down, inline: true },
    )
    .setTimestamp()
    .setFooter('Provided by Urban Dictionary', 'https://i.imgur.com/WL9bm5v.png')
}

const defineTerm = async (term) => {
  const response = await got(API_URL, { searchParams: { term: term } }).json()
  return response.list.length ? getResultMessage(response.list[0]) : `No definitions were found for ${term}.`
}

module.exports = {
  defineTerm
}