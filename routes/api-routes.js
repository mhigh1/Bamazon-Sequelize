const db = require('../models');

module.exports = function(app) {

  app.get('/api/products', function(req, res) {
    db.Product.findAll({})
    .then(function(data) {
      res.json(data);
    }).catch(function(error) {
      res.json({error: error});
    });
  });

  app.get('/api/product/:id', function(req, res) {
    db.Product.find({
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(error) {
      res.json({error: error});
    });
  });

  app.put('/api/product/:id', function(req, res) {
    db.Product.update(req.body, {
      where: { 
        id: req.params.id 
      }
    }).then(function(data) {
      res.json({ success: true, data: data });
    }).catch(function(error) {
      res.json({ success: false, error: error });
    });
  });
  
};