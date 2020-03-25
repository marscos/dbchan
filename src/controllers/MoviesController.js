require('dotenv').config()
const got = require('got')
const TMDB_KEY = process.env.TMDB_KEY
const API_URL = "https://api.themoviedb.org/3/search/movie"
const EMBED_URL = "https://www.themoviedb.org/movie/"

const getResultMessage = (movie) => {
    let text = `:movie_camera: **${movie.title}** (${movie.release_date.split("-").shift()}) :star:${movie.vote_average}\n*${movie.overview}*\n`
    let link = `${EMBED_URL}${movie.id}`
    return {
        content: text+link
    }
}

const searchMovie = async (query) => {
    let params = {
        query: query,
        api_key: TMDB_KEY
    }
    try {
        const response = await got(API_URL, {searchParams: params}).json()
        if (response.results.length) {
            let movie = response.results[0]
            return getResultMessage(movie)
        } else {
            return `No movies found by looking for "\`${query}\`" in TMDb.`
        }
    } catch(error) {
        console.log(error)
        return "Movie not found because of an internal issue."
    }
}

module.exports = { searchMovie }