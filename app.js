var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var routePrefix = '/api'; // API route prefix
var trendsRoute = require('./routes/trends');

app.use(cors()); // used to enable CORS (Cross-origin resource sharing)
app.use(logger('dev'));  // HTTP request logger middleware

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// ROUTES FOR OUR API
var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function (req, res) {
    res.json({
        message: 'welcome to our api!'
    });
});

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use(routePrefix + '/trends', trendsRoute);

module.exports = app;