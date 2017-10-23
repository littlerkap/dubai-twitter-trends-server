var express = require('express');
var router = express.Router();
var _ = require('lodash');
var client = require('../twitter-config'); // Twitter API client
var utils = require('../utils/utils'); // Helper function module

/* GET top 25 trending topics in dubai. */
router.get('/', function (req, res, next) {
  var options = {
    id: 1940345 //WOEID for Dubai
  };

  client.get('trends/place', options)
    .then(function (trends) {
      var aTrends = trends[0].trends; //Get trends in Array
      var _trends = _.take(aTrends, 25); // 25 Trends taken from the beginning.

      // Send response with data and status code 200
      res.status(200);
      res.json({
        success: true,
        data: _trends
      });
    })
    .catch(function (error) {
      // Send response with error objectand  status code 500
      res.status(500);
      res.json({
        success: false,
        error: error[0]
      });
    });
});

router.get('/search', function (req, res, next) {
  var searchQuery = req.query.q; // Get query param 'q' from query string

  client.get('search/tweets', {
      q: searchQuery,
      count: 25
    })
    .then(function (tweets) {
      // Array of keys that should be reduced from the actual tweet object
      var tweetObjKeys = ['created_at', 'text', 'user.name', 'user.screen_name', 'quote_count', 'retweet_count', 'favorite_count'];
      var _tweets = utils.reduceCollection(tweets.statuses, tweetObjKeys);

      console.log(tweets.search_metadata.count);

      // Send response with data and status code 200
      res.status(200);
      res.json({
        success: true,
        data: _tweets
      });
    })
    .catch(function (error) {
      // Send response with error objectand  status code 500
      res.status(500);
      res.json({
        success: false,
        error: error[0]
      });
    });
});

module.exports = router;