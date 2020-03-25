require('dotenv').config()
const got = require('got')
const { MessageEmbed } = require('discord.js')
const TMDB_KEY = process.env.TMDB_KEY
const API_URL = 'https://api.themoviedb.org/3/search/movie'
const MOVIE_URL_PREFIX = 'https://www.themoviedb.org/movie/'
const IMAGE_URL_PREFIX = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'

const getResultMessage = (movie) => {
  const movieURL = `${MOVIE_URL_PREFIX}${movie.id}`
  return new MessageEmbed()
    .setColor('#01d277')
    .setTitle(movie.title)
    .setURL(movieURL)
    .setDescription(movie.overview)
    .setThumbnail(IMAGE_URL_PREFIX + movie.poster_path)
    .addFields(
      { name: 'Vote Average', value: movie.vote_average, inline: true },
      { name: 'Vote Count', value: movie.vote_count, inline: true }
    )
    .setTimestamp()
    .setFooter('Provided by TMDb', 'https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png')
}

const searchMovie = async (query) => {
  const params = {
    query: query,
    api_key: TMDB_KEY
  }
  try {
    const response = await got(API_URL, { searchParams: params }).json()
    if (response.results.length) {
      const movie = response.results[0]
      return getResultMessage(movie)
    } else {
      return `No movies found by looking for "\`${query}\`" in TMDb.`
    }
  } catch (error) {
    console.log(error)
    return 'Movie not found because of an internal issue.'
  }
}

module.exports = { searchMovie }
