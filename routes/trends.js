var express = require('express');
var router = express.Router();
var client = require('../twitter-config'); // Twitter API client
var _ = require('lodash');

/* GET top 25 trending topics in dubai. */
router.get('/', function (req, res, next) {
  var options = {
    id: 1940345 //WOEID for Dubai
  };

  client.get('trends/place', options)
    .then(function (trends) {
      var aTrends = trends[0].trends; //Get trends in Array
      var _trends = _.take(aTrends, 25); // 25 Trends taken from the beginning.

      // Send response with status code 200 and data
      res.status(200);
      res.json({
        success: true,
        data: _trends
      });
    })
    .catch(function (error) {
      // Send response with status code 500 and error
      res.status(500);
      res.json({
        success: false,
        error: error[0]
      });
    })
});

module.exports = router;