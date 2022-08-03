// routes create sessions
// and call a single .run query

// geometry.js
const Geometry = require('../models/geometry')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , loginRequired = require('../middlewares/loginRequired')
  , dbUtils = require('../neo4j/dbUtils');


// this is a callback
exports.list = function (req, res, next) {
  Geometry.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};