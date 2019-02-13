// DEPENDENCIES //
require('dotenv').config();
const express = require('express');
const path = require('path');

// Instatiate the express app
const app = express();
const PORT = process.env.PORT || 8080;

// Require models for syncing
const db = require('./models');

// MIDDLEWARE //
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Parse application/json
app.use(express.json());

// ROUTES //
require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);


if(process.env.NODE_ENV !== 'test') {
  // Sync models and start the express app
  db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log(`Bamazon-Sequelize is listening on PORT ${PORT}`);
    });
  }).catch(function(err) {
    console.log('Error:', err.message);
  });
};

module.exports = app;