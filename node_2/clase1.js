const http = require("node:http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log("request recieved:", req.url);
  if (req.url == "/") {
    req.statusCode = 200;
    res.end("pagina principal");
  } else if (req.url == "/contacts") {
    req.statusCode = 200;
    res.end("contactos");
  } else if (req.url == "/imagen") {
    fs.readFile("./imagen.png", (err, data) => {
      if (err) {
        req.statusCode = 500;
        res.end("500 interal error");
      } else {
        res.setHeader("Content-Type", "image/png");
        res.end(data);
      }
    });
  } else {
    req.statusCode = 404;
    res.end("<h1>Page no fund 404</h1>");
  }
});

server.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
});
