var express = require('express');
var router = express.Router();
var _ = require('lodash');
var client = require('../twitter-config'); // Twitter API client
var utils = require('../utils/utils'); // Helper module
var socketapi = require('../utils/socketapi');

/**
 * This route path will match requests to '/api/trends'
 */
router.get('/', function (req, res, next) {
  /**
   * Returns promise of the top 25 trending topics for a dubai
   * @parameters 
   *   id - Where On Earth ID of the dubai to return trending information.
   * 
   * Note: ID is static for dubai. We can get WOEID in queryparam and make it dynamic for any country/city
   */
  client.get('trends/place', {
      id: 1940345
    })
    .then(function (trends) {
      var aTrends = trends[0].trends; //Get trends in Array
      var _trends = _.take(aTrends, 25); // 25 Trends taken from the beginning.

      /**
       * Send response with trending topics and status code 200 OK
       */
      res.status(200);
      res.json({
        success: true,
        data: _trends
      });
    })
    .catch(function (error) {
      /**
       * Send response with error object and status code 500
       */
      res.status(500);
      res.json({
        success: false,
        error: error[0]
      });
    });
});

/**
 * This route path will match requests to '/api/trends/search'
 */
router.get('/search', function (req, res, next) {
  /**
   * Fetch query param 'q' from HTTP request object
   */
  var searchQuery = req.query.q;

  /**
   * Returns promise with collection of relevant Tweets matching a specified search query
   *  @parameters 
   *    q - search query
   *    count - The number of tweets to return per page,
   */
  client.get('search/tweets', {
      q: searchQuery,
      count: 30
    })
    .then(function (tweets) {
      // Get reduced tweets using helper function
      var _tweets = utils.reduceCollection(tweets.statuses, utils.tweetObjKeys);

      /**
       * Send response with collection of tweets and status code 200 OK
       */
      res.status(200);
      res.json({
        success: true,
        data: _tweets
      });

      // This will fetch realtime tweets from streaming API
      socketapi.getRealtimeTweets();
    })
    .catch(function (error) {
      /**
       * Send response with error object and status code 500
       */
      res.status(500);
      res.json({
        success: false,
        error: error[0]
      });
    });
});

module.exports = router;