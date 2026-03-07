const express = require('express');
const path = require('path');
const app = require('./app');
require('./db');
const PORT = process.env.PORT || 5001;

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`AnonyTalk server running on port ${PORT}`);
});
