const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BUILD_DIR = '.fumadocs';

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.md': 'text/markdown',
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Resolve file path
  const filePath = path.join(BUILD_DIR, pathname);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>404 - Page Not Found</title></head>
            <body>
              <h1>404 - Page Not Found</h1>
              <p>The requested file ${pathname} was not found.</p>
              <a href="/">Go to Home</a>
            </body>
          </html>
        `);
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>500 - Server Error</title></head>
            <body>
              <h1>500 - Server Error</h1>
              <p>An error occurred while processing your request.</p>
              <a href="/">Go to Home</a>
            </body>
          </html>
        `);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log('🚀 Aran API Sentinel Documentation Server');
  console.log('=========================================');
  console.log(`📁 Serving from: ${BUILD_DIR}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/index.html`);
  console.log('');
  console.log('📸 Screenshots available at:');
  console.log(`   http://localhost:${PORT}/screenshots/`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down documentation server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
}); 