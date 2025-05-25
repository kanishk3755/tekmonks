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
  let index = 0;

  while (stories.length < 6) {
    const anchorStart = sectionHtml.indexOf("<a", index);
    if (anchorStart === -1) break;

    const anchorEnd = sectionHtml.indexOf("</a>", anchorStart);
    if (anchorEnd === -1) break;

    const anchorHtml = sectionHtml.slice(anchorStart, anchorEnd + 4); // Include '</a>'

    const hrefStart = anchorHtml.indexOf('href="');
    const hrefEnd = anchorHtml.indexOf('"', hrefStart + 6);
    const href = anchorHtml.slice(hrefStart + 6, hrefEnd);

    const h3Start = anchorHtml.indexOf("<h3");
    const h3OpenEnd = anchorHtml.indexOf(">", h3Start);
    const h3Close = anchorHtml.indexOf("</h3>", h3OpenEnd);
    const title = anchorHtml
      .slice(h3OpenEnd + 1, h3Close)
      .replace(/\s+/g, " ")
      .trim();

    if (href && title && href.startsWith("/")) {
      stories.push({
        title,
        link: `https://time.com${href}`,
      });
    }
    index = anchorEnd + 4;
  }
  return stories;
}

module.exports = {
  fetchTimeHomepage,
  extractStories,
};
