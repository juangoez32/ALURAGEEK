const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5501; // Cambiado a 5501

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  }[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });

  // Lógica para manejar la solicitud GET en la ruta /api/products
  if (req.method === 'GET' && req.url === '/api/products') {
    fs.readFile('data/products.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error reading products file!' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }

  // Lógica para guardar un nuevo producto en products.json
  if (req.method === 'POST' && req.url === '/api/products') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const product = JSON.parse(body);
        saveProduct(product, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error saving product!' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product saved successfully!' }));
          }
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid product data!' }));
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

function saveProduct(product, callback) {
  fs.readFile('data/products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      callback(err);
      return;
    }
    
    let products = JSON.parse(data);
    products.products.push(product);
    
    fs.writeFile('data/products.json', JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        callback(err);
      } else {
        console.log('Product saved successfully!');
        callback(null);
      }
    });
  });
}
