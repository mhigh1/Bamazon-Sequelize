// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const db = require('../models');
const expect = chai.expect;

// Setup the Chia HTTP middleware
chai.use(chaiHttp);

// Declare variable for HTTP requests
let request;

describe('GET /api/products', function () {
  
    // clear the test db 
    beforeEach(function () {
      request = chai.request(server);
      return db.sequelize.sync({ force: true });
    });
  
    it('should return all products', function(done) {
      // add some content to the now empty db
      
      db.Product.bulkCreate([
        { product_name: 'Amazon Echo', department_name: 'Electronics', price: 2.99, stock_quantity: 5, photo: ''},
        { product_name: 'OXO Cutting Board', department_name: 'Home & Kitchen', price: 5.99, stock_quantity: 10, photo: ''},
        { product_name: 'Avengers: Infinity War', department_name: 'Movies, Music, & Games', price: 8.99, stock_quantity: 20, photo: ''}
      ]).then(function () {
  
        request.get('/api/products').end(function (err, res) {
          let responseStatus = res.status;
          let responseBody = res.body;
  
          // Write test expectations
          expect(err).to.be.null;
  
          expect(responseStatus).to.equal(200);
  
          expect(responseBody)
            .to.be.an('array')
            .that.has.lengthOf(3);
  
          expect(responseBody[0])
            .to.be.an('object')
            .have.property('product_name', 'Amazon Echo');
  
          expect(responseBody[2])
            .to.be.an('object')
            .have.property('product_name', 'Avengers: Infinity War');
          done();
        });
      });
    });
  });
