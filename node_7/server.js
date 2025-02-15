import express from 'express'
import { userRouter } from './user-router.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const app = express()
app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies?.user_cookie
  req.session = { user: null }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY)
    req.session.user = data
  } catch {}
  next()
})

app.use('/users', userRouter)

const port = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  const { user } = req.session

  res.render('example', user)
})

app.listen(port, () => {
  console.log(`server running on https://localhost:${port}`)
})
