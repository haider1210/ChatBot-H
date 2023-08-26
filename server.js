const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 60000;

// Serve the app.js file
app.use(express.static(path.join(__dirname, './')));

// Expose the API key to the client
app.get('/api-key', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
