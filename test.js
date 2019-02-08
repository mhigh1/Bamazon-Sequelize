// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const db = require('./models');
const expect = chai.expect;

// Setup the Chia HTTP middleware
chai.use(chaiHttp);

// Declare variable for HTTP requests
let request;

