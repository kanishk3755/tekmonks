const http = require("http");
const handleTimeStories = require("./routes/getTimeStories");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const handled = handleTimeStories(req, res);

  if (!handled) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
