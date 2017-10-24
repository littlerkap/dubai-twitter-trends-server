var socket_io = require('socket.io');
var io = socket_io();
var client = require('../twitter-config'); // Twitter API client
var utils = require('../utils/utils'); // Helper module
var _ = require('lodash');

/**
 * Socket module
 * @module socketapi
 */
var socketapi = {
  // Global socket io object
  io: io,

  /**
   * Fetch realtime tweets through socket connection and Twitter streaming APIs
   */
  getRealtimeTweets: function () {
    /**
     * Socket: 'connection' event listener
     */
    io.once('connection', function (socket) {
      var stream;

      /**
       * Socket: 'find-tweet' event listener. Receives event from socket.
       * @function {void} Callback funciton called when socket receives 'find-tweet' event 
       *   @param {string} query - Keyword to track
       */
      socket.on('find-tweet', function (query) {
        /**
         * Call to Twitter stream api: Filter realtime Tweets. 
         */
        stream = client.stream('statuses/filter', {
          track: query
        });

        /**
         * Twitter stream: 'data' event listener
         * @function {void} Callback funciton called when socket receives 'find-tweet' event 
         *   @param {string} event - Tweet object
         */
        stream.on('data', function (event) {
          // Reduce tweet object using lodash function
          var tweet = _.pick(event, utils.tweetObjKeys);
          tweet.isNew = true;

          console.log(event && event.text);

          /**
           * Emits 'tweet' event to socket
           */
          socket.emit('tweet', {
            tweet: tweet
          });
        });

        /**
         * Twitter stream: 'error' event listeners\
         * Just log on console
         */
        stream.on('error', function (error) {
          console.log(error);
        });
      });

      /**
       * Socket: 'disconnect' event listener. Receives event from socket.
       * Destroy stream on socket disconnect event. It'll stop previous keyword tracking
       */
      socket.on('disconnect', function () {
        stream.destroy();
      });
    });
  }
}

module.exports = socketapi;