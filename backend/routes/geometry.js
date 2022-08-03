// routes create sessions
// and call a single .run query

// movies.js
const Geometry = require('../models/geometry')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , loginRequired = require('../middlewares/loginRequired')
  , dbUtils = require('../neo4j/dbUtils');

// api.get("/hex/:subtype", routes.geometry.listHexes);
exports.listHexagons = function (req, res, next) {
  Geometry.getHexagonShapes(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/osm_point/:subtype", routes.geometry.listOSMPoints);
exports.listOSMPoints = function (req, res, next) {
  Geometry.getOSMPoints(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/transit_point/:subtype", routes.geometry.listTransitPoints);
exports.listTransitPoints = function (req, res, next) {
  Geometry.getTransitPoints(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/street/:subtype", routes.geometry.listStreets);
exports.listStreets = function (req, res, next) {
  Geometry.getStreetPaths(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/transit_path/:subtype", routes.geometry.listTransitPaths);
exports.listTransitPaths = function (req, res, next) {
  Geometry.getTransitPaths(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/footway/:subtype", routes.geometry.listFootways);
exports.listFootways = function (req, res, next) {
  Geometry.getFootwayPaths(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/natural_path/:subtype", routes.geometry.listNaturalPaths);
exports.listNaturalPaths = function (req, res, next) {
  Geometry.getNaturalPaths(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/building/:subtype", routes.geometry.listBuildings);
exports.listBuildings = function (req, res, next) {
  Geometry.getBuildingMesh(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/locale/:subtype", routes.geometry.listLocales);
exports.listLocales = function (req, res, next) {
  Geometry.getLocaleShapes(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/parking/:subtype", routes.geometry.listParking);
exports.listParking = function (req, res, next) {
  Geometry.getParkingMesh(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/block/:subtype", routes.geometry.listBlocks);
exports.listBlocks = function (req, res, next) {
  Geometry.getBlockShapes(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/parcel/:subtype", routes.geometry.listParcels);
exports.listParcels = function (req, res, next) {
  Geometry.getParcelShapes(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/zoning/:subtype", routes.geometry.listZoning);
exports.listZoning = function (req, res, next) {
  Geometry.getZoningShapes(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/graph/:subtype", routes.geometry.listGraphs);
exports.listGraphs = function (req, res, next) {
  Geometry.getGraphMorphs(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// api.get("/capacity/:subtype", routes.geometry.listCapacity);
exports.listCapacity = function (req, res, next) {
  Geometry.getCapacityMesh(dbUtils.getSession(req), req.params.subtype)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findById = function (req, res, next) {
  /*
  Movies.getById(dbUtils.getSession(req), req.params.id, req.user.id)
    .then(response => writeResponse(res, response))
    .catch(next);
  */
};

/**
 * @swagger
 * /api/v0/movies/{id}:
 *   get:
 *     tags:
 *     - movies
 *     description: Find movie by ID
 *     summary: Find movie by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: movie id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: Authorization
 *         in: header
 *         type: string
 *         description: Token (token goes here)
 *     responses:
 *       200:
 *         description: A movie
 *         schema:
 *           $ref: '#/definitions/Movie'
 *       404:
 *         description: movie not found
 */

/*
exports.findById = function (req, res, next) {
  Movies.getById(dbUtils.getSession(req), req.params.id, req.user.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findByGenre = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Movies.getByGenre(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findMoviesByDateRange = function (req, res, next) {
  const start = req.params.start;
  const end = req.params.end;

  if (!start) throw {message: 'Invalid start', status: 400};
  if (!end) throw {message: 'Invalid end', status: 400};

  Movies.getByDateRange(dbUtils.getSession(req), start, end)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findMoviesByDirector = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Movies.getMoviesbyDirector(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findMoviesByActor = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Movies.getByActor(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findMoviesByWriter = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Movies.getMoviesByWriter(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.rateMovie = function (req, res, next) {
  loginRequired(req, res, () => {
    const rating = Number(_.get(req.body, 'rating'));
    if (Number.isNaN(rating) || rating < 0 || rating >= 6) {
      throw {rating: 'Rating value is invalid', status: 400};
    }

    Movies.rate(dbUtils.getSession(req), req.params.id, req.user.id, rating)
      .then(response => writeResponse(res, {}))
      .catch(next);
  });
};

exports.deleteMovieRating = function (req, res, next) {
  if (!req.params.id) {
    throw {message: 'Invalid movie id', status: 400};
  }

  loginRequired(req, res, () => {
    Movies.deleteRating(dbUtils.getSession(req), req.params.id, req.user.id)
      .then(response => writeResponse(res, response, 204))
      .catch(next);
  })
};

exports.findMoviesRatedByMe = function (req, res, next) {
  loginRequired(req, res, () => {
    Movies.getRatedByUser(dbUtils.getSession(req), req.user.id)
      .then(response => writeResponse(res, response, 200))
      .catch(next);
  })
};

exports.getRecommendedMovies = function (req, res, next) {
  loginRequired(req, res, () => {
    Movies.getRecommended(dbUtils.getSession(req), req.user.id)
      .then(response => writeResponse(res, response, 200))
      .catch(next);
  })
};
*/