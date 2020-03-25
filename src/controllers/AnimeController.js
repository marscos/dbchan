require('dotenv').config()
const { MessageEmbed } = require('discord.js')
const graphqlGot = require('graphql-got')
const sanitizeHtml = require('sanitize-html')

const API_URL = 'https://graphql.anilist.co'

const query = `
query ($title: String, $offset: Int, $pageSize: Int) { 
  Page (page: $offset, perPage: $pageSize) {
    SERIES: media (search: $title, sort: SEARCH_MATCH) { 
        id
        title {
          english
          romaji
          native
        }
        type
        status
        episodes
        chapters
        genres
        description(asHtml: false)
        coverImage {
            medium
            large
        }
        meanScore
        siteUrl
      }
  }
}
`

const getResultMessage = (media) => {
  const displayTitle = `${media.title.english ? media.title.english : media.title.native ? media.title.native : media.title.romaji}` +
  ` ${(media.title.english || media.title.native) && media.title.english !== media.title.romaji ? '(' + media.title.romaji + ')' : ''}`

  return new MessageEmbed()
    .setColor('#02a9ff')
    .setTitle(displayTitle)
    .setURL(media.siteUrl)
    .setDescription(sanitizeHtml(media.description, { allowedTags: [] }))
    .setThumbnail(media.coverImage.large)
    .addFields(
      { name: 'Genres', value: media.genres.join(', ') },
      { name: 'Mean Score', value: media.meanScore, inline: true },
      { name: 'Status', value: `\n${media.status} → ${media.type === 'MANGA' ? media.chapters === null ? '???' : media.chapters : media.episodes} ${media.type === 'MANGA' ? 'Chapters' : 'Episodes'}`, inline: true }
    )
    .setTimestamp()
    .setFooter('Provided by AniList', 'https://anilist.co/img/icons/android-chrome-512x512.png')
}

const searchAnime = async (title) => {
  const queryVariables = {
    title: title,
    offset: 0,
    pageSize: 1
  }
  const response = await graphqlGot(API_URL, { query, variables: queryVariables })

  return getResultMessage(response.body.Page.SERIES[0])
}

module.exports = { searchAnime }
