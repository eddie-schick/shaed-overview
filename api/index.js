const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the client dist directory
const staticPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(staticPath));

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

module.exports = app;
