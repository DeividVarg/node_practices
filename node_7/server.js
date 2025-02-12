import express from 'express'
import { userRouter } from './user-router.js'
const app = express()

app.set('view engine', 'ejs')

const port = process.env.PORT ?? 3000

app.use(express.json())

app.use('/users', userRouter)

app.get('/', (req, res) => {
  res.render('example', { name: 'deivid' })
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
