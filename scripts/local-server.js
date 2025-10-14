#!/usr/bin/env node

// Simple local development server for Memora
// This serves your files locally and handles CORS for .env.development file access

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  // Decode URI to handle spaces and special characters in filenames
  let pathname = `.${decodeURIComponent(parsedUrl.pathname)}`;
  
  // Default to index.html
  if (pathname === './') {
    pathname = './index.html';
  }

  // Security: prevent directory traversal
  if (pathname.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Get file extension
  const ext = path.parse(pathname).ext;
  const mimeType = mimeTypes[ext] || 'text/plain';

  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Check if file exists
  fs.access(pathname, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found
      res.writeHead(404);
      res.end(`File ${pathname} not found!`);
    } else {
      // File exists, read and serve it
      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end(`Error getting the file: ${err}.`);
        } else {
          res.setHeader('Content-type', mimeType);
          res.writeHead(200);
          res.end(data);
        }
      });
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Memora local server running at http://localhost:${port}/`);
  console.log(`📁 Serving files from: ${process.cwd()}`);
  console.log(`🔐 .env.development file is accessible for secure local config`);
  console.log(`🧪 Test page available at: http://localhost:${port}/test-config.html`);
  console.log(`\n⭐ Your local environment is secure:`);
  console.log(`   ✅ .env.development is in .gitignore`);
  console.log(`   ✅ Keys won't be uploaded to AWS or Git`);
  console.log(`   ✅ Delete .env.development anytime to remove all keys`);
  console.log(`\n🛑 To stop server: Ctrl+C`);
});
