import { Router } from 'express'
import { userRepository } from './user-repository.js'

export const userRouter = Router()

userRouter.get('/', (req, res) => {
  res.json({ message: 'User API' })
})

userRouter.get('/proteced', (req, res) => {})

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await userRepository.login({ username, password })
    res.send(user)
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

userRouter.post('/logout', (req, res) => {})
