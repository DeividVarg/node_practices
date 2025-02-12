import express from "express";
import { port } from "./config.js";
import userRoutes from "./routes/user.routes.js";
import morgan from "morgan";
import multer from "multer";

const app = express();
app.use(morgan("dev"));

const upload = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
app.use(multer(upload).single("image"));
app.use(express.json());
app.listen(port);

app.use(userRoutes);
console.log("Server listening on port", port);
