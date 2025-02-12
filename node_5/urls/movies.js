import { Router } from "express";
import { MoviesControllers } from "../controlers/movies.js";
export const movieRouter = Router();

export const MovieRouter = ({ movieModel }) => {
  const movieController = new MoviesControllers({ movieModel });

  movieRouter.get("/", movieController.getAll);

  movieRouter.get("/:id", movieController.getId);

  movieRouter.post("/", movieController.create);

  movieRouter.delete("/:id", movieController.delete);

  movieRouter.patch("/:id", movieController.update);

  return movieRouter;
};
