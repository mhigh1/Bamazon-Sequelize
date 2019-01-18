// DEPENDENCIES //
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

// Sync models and start the express app
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log(`Bamazon-Sequelize is listening on PORT ${PORT}`);
  });
});