var _ = require('lodash');

// Module for helper functions
module.exports = {
  reduceCollection: function (collection, criteria) {
    // Reduce to specific keys in a collection
    return _.map(collection, _.partial(_.pick, _, criteria));
  }
}