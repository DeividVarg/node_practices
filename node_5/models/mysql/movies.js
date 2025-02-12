import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '3030',
  database: 'moviesdb',
}

const connection = await mysql.createConnection(config)

export class movieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const [genres] = await connection.query(
        'select id, name from genre where lower(name) = ?',
        [lowerCaseGenre]
      )

      if (genres.length === 0) {
        return []
      }

      const [{ id }] = genres

      const [genresId] = await connection.query(
        'select * from movies_genres where genre_id = ?',
        [id]
      )

      if (genresId.length == 0) return null

      const [{ genre_id }] = genresId

      const moviesGenre = await connection.query(
        'SELECT  movies.title,movies.year,movies.director,movies.duration,movies.poster,movies.rate,genre.name as genre FROM movies JOIN movies_genres ON movies.id = movies_genres.movie_id JOIN genre ON genre.id = movies_genres.genre_id WHERE movies_genres.genre_id = ?;',
        [genre_id]
      )
      return moviesGenre
    }

    const [movies] = await connection.query(
      'select *, bin_to_uuid(id) id from movies'
    )
    return movies
  }
  static async getById({ id }) {
    try {
      const [movie] = await connection.query(
        'SELECT *, bin_to_uuid(id) id FROM movies WHERE id = uuid_to_bin(?)',
        [id]
      )
      return movie[0]
    } catch (e) {
      return null
    }
  }

  static async create({ data }) {
    const {
      genre: genreinput,
      title,
      year,
      duration,
      director,
      poster,
      rate,
    } = data

    const [uuidResoult] = await connection.query('select uuid() uuid')
    const [{ uuid }] = uuidResoult

    try {
      const [result] = await connection.query(
        `insert into movies (id,title,year,duration,director,poster,rate) values (uuid_to_bin(?),?,?,?,?,?,?)`,
        [uuid, title, year, duration, director, poster, rate]
      )

      return result
    } catch (e) {
      console.log(e)
      throw new Error('error to create movie')
    }
  }

  static async delete({ id }) {
    try {
      const [result] = await connection.query(
        'delete from movies where id = uuid_to_bin(?)',
        [id]
      )
    } catch (e) {
      throw new Error('error to delete movie')
    }
    return
  }

  static async update({ id, data }) {
    const {
      genre: genreinput,
      title: titleinput,
      year: yearinput,
      duration: durationinput,
      director: directorinput,
      poster: posterinput,
      rate: rateinput,
    } = data

    const [Result] = await connection.query(
      'SELECT *, bin_to_uuid(id) id FROM movies WHERE id = uuid_to_bin(?)',
      [id]
    )
    try {
      const [{ title, year, duration, director, poster, rate }] = [Result[0]]
      const [result] = await connection.query(
        `update movies set title = ?,year = ?,duration = ?,director = ?,poster = ?,rate = ? where id = uuid_to_bin(?)`,
        [
          titleinput ?? title,
          yearinput ?? year,
          durationinput ?? duration,
          directorinput ?? director,
          posterinput ?? poster,
          rateinput ?? rate,
          id,
        ]
      )
      return result
    } catch (e) {
      return null
    }
  }
}
