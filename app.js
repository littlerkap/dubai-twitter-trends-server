var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs')
var logger = require('morgan');
var cors = require('cors');
var routePrefix = '/api'; // API route prefix
var trendsRoute = require('./routes/trends');

app.use(cors()); // used to enable CORS (Cross-origin resource sharing)

// log only 4xx and 5xx responses to console
app.use(logger('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }
}))

// log all requests to access.log
app.use(logger('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
        flags: 'a'
    })
}))

/**
 * Configure app to use bodyParser()
 * This will let us get the data from a POST
 */
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

/**
 * REGISTER OUR API ROUTES
 * All our API routes will be prefixed with '/api'
 */
app.use('/api', router);
app.use(routePrefix + '/trends', trendsRoute);

module.exports = app;