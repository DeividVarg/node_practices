const http = require("http");
const dittoJSON = require("./pokemon/ditto.json");

const processRequest = (req, res) => {
  const { method, url } = req;
  switch (method) {
    case "GET":
      switch (url) {
        case "/pokemon/ditto":
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(dittoJSON));
        default:
          res.setHeader("Content-Type", "text/html");
          res.statusCode(404);
          res.end("<h1>404</h1>");
      }
    case "POST":
      switch (url) {
        case "/pokemon": {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            const data = JSON.parse(body);
            res.writeHead(201, "content-type: application/json; charset=utf-8");
            res.end(JSON.stringify(data));
          });
          break;
        }
        default:
          res.setHeader("Content-Type", "text/html");
          res.statusCode(404);
          res.end("<h1>404</h1>");
      }
  }
};
const server = http.createServer(processRequest);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
