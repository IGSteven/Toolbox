const express = require('express');
const app = express();
const port = 443;

// Redirect HomePage to Docs
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// API 
app.use('/api', require(__basedir + '/src/api'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});