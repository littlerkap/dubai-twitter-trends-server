var socket_io = require('socket.io');
var io = socket_io();
var client = require('../twitter-config'); // Twitter API client
var _ = require('lodash');

var socketapi = {
  io: io,
  getRealtimeTweets: function () {
    io.once('connection', (socket) => {
      console.log('user connected');
      var stream;

      socket.on('find-tweet', function (query) {
        console.log('query:', query);

        // FIX for issue 'Exceeded connection limit for user'
          console.log('get stream data');
          stream = client.stream('statuses/filter', {
            track: query
          });

          stream.on('data', function (event) {
            console.log(event && event.text);
            var tweetObjKeys = ['created_at', 'text', 'user.name', 'user.screen_name', 'retweet_count', 'favorite_count'];
            var tweet = _.pick(event, tweetObjKeys);
            tweet.isNew = true;

            socket.emit('tweet', {
              tweet: tweet
            });
          });

          stream.on('error', function (error) {
            console.log(error);
          });
      });

      socket.on('disconnect', function () {
        console.log('user disconnected');
        stream.destroy();
      });
    });
  }
}


module.exports = socketapi;