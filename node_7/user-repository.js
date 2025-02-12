import DBLocal from 'db-local'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const user = Schema('User', {
  _id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})
export class userRepository {
  static async create({ username, password }) {
    validators.username(username)
    validators.password(password)
    const User = user.findOne({
      username,
    })
    if (User) throw new Error('user already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)

    user
      .create({
        _id: id,
        username,
        password: hashedPassword,
      })
      .save()

    return id
  }

  static async login({ username, password }) {
    validators.username(username)
    validators.password(password)

    const User = user.findOne({ username: username })
    if (!User) throw new Error('user not found')

    const isValid = await bcrypt.compare(password, User.password)
    if (!isValid) throw new Error('Password is invalid')

    const { password: _, ...publicUser } = User
    return publicUser
  }
}

class validators {
  static username(username) {
    if (typeof username !== 'string') {
      throw new Error('Username invalid')
    }
    if (username.length < 3) {
      throw new Error('Username is a too short')
    }
  }
  static password(password) {
    if (typeof password !== 'string') {
      throw new Error('password invalid')
    }
    if (password.length < 3) {
      throw new Error('password is a too short')
    }
  }
}
