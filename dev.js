const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Live reload clients
const sseClients = new Set();

function notifyClients() {
  for (const client of sseClients) {
    client.write('data: reload\n\n');
  }
}

// Watch files for hot reload
fs.watch(ROOT, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  if (filename.startsWith('.git') || filename === 'dev.js') return;
  // Debounce slightly
  clearTimeout(notifyClients._timer);
  notifyClients._timer = setTimeout(() => {
    console.log(`[live-reload] File changed: ${filename}`);
    notifyClients();
  }, 80);
});

function parseFrontMatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent };
  }
  const data = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      data[key] = val;
    }
  }
  return { data, content: match[2] };
}

function renderPage(filePath, urlPath) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseFrontMatter(rawContent);

  const layoutName = data.layout || (urlPath.startsWith('/antechamber') ? 'antechamber' : null);
  let rendered = content;

  if (layoutName) {
    const layoutPath = path.join(ROOT, '_layouts', `${layoutName}.html`);
    if (fs.existsSync(layoutPath)) {
      let layoutHtml = fs.readFileSync(layoutPath, 'utf8');

      // Inject content
      layoutHtml = layoutHtml.replace('{{ content }}', rendered);

      // Handle page.title
      if (data.title) {
        layoutHtml = layoutHtml.replace(
          /{% if page\.title %}[\s\S]*?{% else %}[\s\S]*?{% endif %}/g,
          `${data.title} · Nadia Cañadas Giménez`
        );
        layoutHtml = layoutHtml.replace(/\{\{\s*page\.title\s*\}\}/g, data.title);
      } else {
        layoutHtml = layoutHtml.replace(
          /{% if page\.title %}[\s\S]*?{% else %}([\s\S]*?){% endif %}/g,
          '$1'
        );
      }

      // Handle page.mermaid
      if (data.mermaid) {
        layoutHtml = layoutHtml.replace(/{% if page\.mermaid %}([\s\S]*?){% endif %}/g, '$1');
      } else {
        layoutHtml = layoutHtml.replace(/{% if page\.mermaid %}[\s\S]*?{% endif %}/g, '');
      }

      // Handle active nav links
      layoutHtml = layoutHtml.replace(
        /{% if page\.url contains '([^']+)' %}aria-current="page"{% endif %}/g,
        (m, p) => (urlPath.includes(p) ? 'aria-current="page"' : '')
      );

      // Handle date
      layoutHtml = layoutHtml.replace(/\{\{\s*'now'\s*\|\s*date:\s*"%Y"\s*\}\}/g, new Date().getFullYear());

      // Handle relative_url filter: {{ '/something' | relative_url }} -> /something
      layoutHtml = layoutHtml.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1');

      rendered = layoutHtml;
    }
  } else {
    // Replace standalone relative_url if any
    rendered = rendered.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1');
  }

  // Inject live reload client snippet before </body>
  const liveReloadScript = `
  <!-- Live Reload Script -->
  <script>
    (function() {
      const evtSource = new EventSource('/__livereload');
      evtSource.onmessage = function(e) {
        if (e.data === 'reload') {
          console.log('[LiveReload] Reloading page...');
          window.location.reload();
        }
      };
      evtSource.onerror = function() {
        setTimeout(() => new EventSource('/__livereload'), 2000);
      };
    })();
  </script>
  </body>`;

  if (rendered.includes('</body>')) {
    rendered = rendered.replace('</body>', liveReloadScript);
  } else {
    rendered += liveReloadScript;
  }

  return rendered;
}

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);

  // SSE endpoint
  if (reqUrl === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // Resolve file
  let filePath = path.join(ROOT, reqUrl);

  // Check if directory -> try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.html') {
    try {
      const html = renderPage(filePath, reqUrl);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error rendering page: ' + err.message);
    }
    return;
  }

  // Static files
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server running at http://localhost:${PORT}`);
  console.log(`👀 Watching for file changes with auto-reload...\n`);
});
