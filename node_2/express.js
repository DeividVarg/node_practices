const express = require("express");
const ditto = require("./pokemon/ditto.json");

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/pokemon/ditto", (req, res) => {
  res.json(ditto);
});

app.post("/pokemon", (req, res) => {
  res.status(201).json(req.body);
});

app.use((req, res) => {
  res.status(404).send("Not Found 404");
});

app.listen(PORT, () => {
  console.log(`server on http://localhost:${PORT}`);
});
