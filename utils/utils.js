var _ = require('lodash');

/**
 * Utility (Helper) module
 * @module utils
 */
module.exports = {
  /**
   * Array of tweet object keys that we use to display on UI
   */
  tweetObjKeys: ['created_at', 'text', 'user.name', 'user.screen_name', 'retweet_count', 'favorite_count'],

  /**
   * Reduce the colletion specified by criteria
   * @param {array} collection - Array of objects that should be reduced
   * @param {array} criteria - Array of keys that should be picked in reduced objects in collection
   * @returns {array} Reduced collection
   */
  reduceCollection: function (collection, criteria) {
    return _.map(collection, _.partial(_.pick, _, criteria));
  }
}