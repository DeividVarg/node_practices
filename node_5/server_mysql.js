import { movieModel } from './models/mysql/movies.js'
import { createApp } from './index.js'

createApp({ moviesModel: movieModel })
