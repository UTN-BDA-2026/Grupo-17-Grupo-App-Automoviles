const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const API_TARGET = 'http://localhost:3000';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // ── Proxy: forward /api/* requests to the backend ──
  if (req.url.startsWith('/api')) {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: 'localhost:3000' },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'No se pudo conectar al backend. ¿Está corriendo en localhost:3000?' }));
    });

    req.pipe(proxyReq);
    return;
  }

  // ── Static files ──
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // SPA fallback: if the file doesn't exist, serve index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ✨ AutoSearch frontend corriendo en:\n`);
  console.log(`     → Local:   http://localhost:${PORT}`);
  console.log(`     → API:     proxied to ${API_TARGET}\n`);
});
