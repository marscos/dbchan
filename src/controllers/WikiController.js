const got = require('got')
const API_URL = 'https://en.wikipedia.org/w/api.php'
const { MessageEmbed } = require('discord.js')

const defaultQueryParams = {
  action: 'query',
  prop: 'extracts|pageimages|info',
  format: 'json',
  exintro: true,
  explaintext: true,
  piprop: 'original',
  iwurl: true,
  generator: 'search',
  exsentences: 2,
  inprop: 'url'
}

const getResultMessage = (page) => {
  return new MessageEmbed()
    .setColor('#f1f1f2')
    .setTitle(page.title)
    .setURL(page.fullurl)
    .setDescription(page.extract)
    .setThumbnail(page.original ? page.original.source : null)
    .setTimestamp()
    .setFooter('Provided by Wikipedia', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png')
}

const searchWiki = async (query) => {
  const queryParams = { gsrsearch: query, ...defaultQueryParams, gsrlimit: '1' }
  const response = await got(API_URL, { searchParams: queryParams }).json()
  if (!response.query) { return `No pages were found searching for ${query}` }
  const pages = response.query.pages
  console.log(queryParams)
  for (const pageId in pages) {
    return getResultMessage(pages[pageId]) // only one result
  }
}

module.exports = { searchWiki }
