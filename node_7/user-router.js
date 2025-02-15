import { Router } from 'express'
import { userRepository } from './user-repository.js'
import { render } from 'ejs'
import jwt from 'jsonwebtoken'

export const userRouter = Router()

userRouter.get('/', (req, res) => {
  res.json({ message: 'User API' })
})

userRouter.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('not authorized')

  res.render('protected', user)
})

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await userRepository.login({ username, password })

    const token = jwt.sign({ user: user.username }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    })

    res
      .cookie('user_cookie', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .send({ user, token })
  } catch (err) {
    res.status(401).send({ error: err.message })
  }
})

userRouter.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await userRepository.create({ username, password })
    res.json({ message: 'user is created', id: { id } })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

userRouter.post('/logout', (req, res) => {
  res.clearCookie('user_cookie').json({ message: 'has cerrado la sesion' })
})
