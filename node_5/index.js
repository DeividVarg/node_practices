import express, { json } from 'express'
import { CorsMiddelware } from './middelweres/cors.js'
import { MovieRouter } from './urls/movies.js'
import { movieModel } from './models/mysql/movies.js'

const app = express()
const port = process.env.PORT || 3000
app.use(json())
app.use(CorsMiddelware())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/movies', MovieRouter({ movieModel: movieModel }))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
