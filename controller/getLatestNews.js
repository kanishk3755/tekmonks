const https = require("https");

function fetchTimeHomepage(callback) {
  https
    .get("https://time.com", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => callback(null, data));
    })
    .on("error", (err) => {
      callback(err, null);
    });
}

function extractStories(html) {
  const stories = [];

  const sectionStart = html.indexOf('<div class="partial latest-stories"');
  if (sectionStart === -1) return stories;

  const sectionEnd = html.indexOf("</section>", sectionStart);
  if (sectionEnd === -1) return stories;

  const sectionHtml = html.slice(sectionStart, sectionEnd);

  const pattern =
    /<a[^>]+href="(\/\d{7}\/[^"]+)"[^>]*>[\s\S]*?<h3[^>]*>(.*?)<\/h3>/g;

  let match;
  while ((match = pattern.exec(sectionHtml)) !== null && stories.length < 6) {
    const link = `https://time.com${match[1]}`;
    const title = match[2].replace(/\s+/g, " ").trim();
    stories.push({ title, link });
  }

  return stories;
}

module.exports = {
  fetchTimeHomepage,
  extractStories,
};
