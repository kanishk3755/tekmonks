const http = require('http');
const https = require('https');

const PORT = 3000;

function fetchTimeHomepage(callback) {
  https.get('https://time.com', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, data));
  }).on('error', (err) => {
    callback(err, null);
  });
}

function extractStories(html) {
  const stories = [];

  // Find the section that includes "latest-stories" and extend the capture
  const sectionStart = html.indexOf('<div class="partial latest-stories"');
  if (sectionStart === -1) return stories;

  const sectionEnd = html.indexOf('</section>', sectionStart); // broader ending
  if (sectionEnd === -1) return stories;

  const sectionHtml = html.slice(sectionStart, sectionEnd);

  // Match anchor tags with href + inner h3
  const pattern = /<a[^>]+href="(\/\d{7}\/[^"]+)"[^>]*>[\s\S]*?<h3[^>]*>(.*?)<\/h3>/g;

  let match;
  while ((match = pattern.exec(sectionHtml)) !== null && stories.length < 6) {
    const link = `https://time.com${match[1]}`;
    const title = match[2].replace(/\s+/g, ' ').trim();

    stories.push({ title, link });
  }

  return stories;
}


const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/getTimeStories') {
    fetchTimeHomepage((err, html) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch Time homepage' }));
        return;
      }

      const stories = extractStories(html);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stories));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/getTimeStories`);
});
