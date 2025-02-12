const express = require("express");
const movies = require("./movies.json");
const crypto = require("crypto");
const { validateMovie, partialMovie } = require("./schemas/movies");
const cors = require("cors");

const app = express();

const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:3000",
        "https://movies.com",
        "https://midu.dev",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).send("Movie not found");
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filter = movies.filter((movie) =>
      movie.genre.some((f) => f.toLowerCase() === genre.toLowerCase())
    );
    res.json(filter);
  }

  res.status(404).send("Movie not found");
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: json.parse(result.error.message) });
  }

  const NewMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(NewMovie);
  res.status(201).json(NewMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = partialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };
  movies[movieIndex] = updateMovie;

  res.json(updateMovie);
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
