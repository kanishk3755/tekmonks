const { fetchTimeHomepage, extractStories } = require("../controller/getLatestNews");

function handleTimeStories(req, res) {
  if (req.method === "GET" && req.url === "/getTimeStories") {
    fetchTimeHomepage((err, html) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch Time homepage"}));
        return;
      }
      const stories = extractStories(html);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(stories));
    });
    return true;
  }
  return false;
}

module.exports = handleTimeStories;
