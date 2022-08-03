const _ = require('lodash');
const q = require('./queries');

// QUERY FUNCTIONS

// get Hexagon geometry
const getHexagonShapes = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qHexagonShape, {subtype:subtype}))).then(r => { return r });
};

const getOSMPoints = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qOSMPointVector, {subtype:subtype}))).then(r => { return r });
};

const getTransitPoints = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qTransitPointVector, {subtype:subtype}))).then(r => { return r });
};

const getStreetPaths = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qStreetPath, {subtype:subtype}))).then(r => { return r });
};

const getTransitPaths = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qTransitPath, {subtype:subtype}))).then(r => { return r });
};

const getFootwayPaths = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qFootwayPath, {subtype:subtype}))).then(r => { return r });
};

const getNaturalPaths = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qNaturalPath, {subtype:subtype}))).then(r => { return r });
};

const getBuildingMesh = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qBuildingMesh, {subtype:subtype}))).then(r => { return r });
};

const getLocaleShapes = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qLocaleShape, {subtype:subtype}))).then(r => { return r });
};

const getParkingMesh = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qParkingMesh, {subtype:subtype}))).then(r => { return r });
};

const getBlockShapes = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qBlockShape, {subtype:subtype}))).then(r => { return r });
};

const getParcelShapes = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qParcelShape, {subtype:subtype}))).then(r => { return r });
};

const getZoningShapes = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qZoningShape, {subtype:subtype}))).then(r => { return r });
};

const getGraphMorphs = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qGraphMorph, {subtype:subtype}))).then(r => { return r });
};

const getCapacityMesh = function (session, subtype) {
  return session.readTransaction(tx => (
    tx.run(q.qCapacityMesh, {subtype:subtype}))).then(r => { return r });
};

// export exposed functions
module.exports = {
  getHexagonShapes,
  getOSMPoints,
  getTransitPoints,
  getStreetPaths,
  getTransitPaths,
  getFootwayPaths,
  getNaturalPaths,
  getBuildingMesh,
  getLocaleShapes,
  getParkingMesh,
  getBlockShapes,
  getParcelShapes,
  getZoningShapes,
  getGraphMorphs,
  getCapacityMesh
};


/*

function attack(result) {
  return result.records.map(r => r.get('subList'));
  result.records.forEach(record => {
    return record.get('subList');
  })
}

// const dbUtils = require('../neo4j/dbUtils');
// const Block = require('../models/neo4j/block');
// const Hex = require('../models/neo4j/hex');

function manyMovies(neo4jResult) {
  return neo4jResult.records.map(r => new Movie(r.get('movie')))
}

const _getByWriter = function (params, options, callback) {
  const cypher_params = { id: params.id };

  const query = [
    'MATCH (:Person {tmdbId: $id})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

const _singleMovieWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Movie(record.get('movie'), record.get('my_rating')));

    result.directors = _.map(record.get('directors'), record => { return new Person(record); });
    
    result.genres = _.map(record.get('genres'), record => { return new Genre(record); });
    
    result.producers = _.map(record.get('producers'), record => { return new Person(record); });
    
    result.writers = _.map(record.get('writers'), record => { return new Person(record); });
    
    result.actors = _.map(record.get('actors'), record => { return record; });
    
    result.related = _.map(record.get('related'), record => { return new Movie(record); });

    return result;
  } else {
    return null;
  }
};



// get a single movie by id
const getById = function (session, movieId, userId) {
  const query = [
    'MATCH (movie:Movie {tmdbId: $movieId})',
    'OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {id: $userId})',
    'OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)',
    'OPTIONAL MATCH (related:Movie)<--(a:Person) WHERE related <> movie',
    'OPTIONAL MATCH (movie)-[:IN_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT movie,',
    'my_rated,',
    'genre, d, p, w, a, r, related, count(related) AS countRelated',
    'ORDER BY countRelated DESC',
    'RETURN DISTINCT movie,',
    'my_rated.rating AS my_rating,',
    'collect(DISTINCT d) AS directors,',
    'collect(DISTINCT p) AS producers,',
    'collect(DISTINCT w) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.tmdbId, poster_image:a.poster, role:r.role}) AS actors,',
    'collect(DISTINCT related) AS related,',
    'collect(DISTINCT genre) AS genres',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        movieId: movieId,
        userId: userId
      })
    )
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleMovieWithDetails(result.records[0]);
      }
      else {
        throw {message: 'movie not found', status: 404}
      }
    });
};

// Get by date range
const getByDateRange = function (session, start, end) {
  const query = [
    'MATCH (movie:Movie)',
    'WHERE movie.released > $start AND movie.released < $end',
    'RETURN movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        start: parseInt(start || 0),
        end: parseInt(end || 0)
      })
    )
    .then(result => manyMovies(result))
};

// Get by date range
const getByActor = function (session, id) {
  const query = [
    'MATCH (actor:Person {tmdbId: $id})-[:ACTED_IN]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        id: id
      })
    ).then(result => manyMovies(result))
};

// get a movie by genre
const getByGenre = function(session, genreId) {
  const query = [
    'MATCH (movie:Movie)-[:IN_GENRE]->(genre)',
    'WHERE toLower(genre.name) = toLower($genreId) OR id(genre) = toInteger($genreId)', // while transitioning to the sandbox data             
    'RETURN movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        genreId: genreId
      })
    ).then(result => manyMovies(result));
};

// Get many movies directed by a person
const getByDirector = function(session, personId) {
  const query = [
    'MATCH (:Person {tmdbId: $personId})-[:DIRECTED]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        personId: personId
      })
    ).then(result => manyMovies(result));
};

// Get many movies written by a person
const getByWriter = function(session, personId) {
  const query = [
    'MATCH (:Person {tmdbId: $personId})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        personId: personId
      })
    ).then(result => manyMovies(result));
};

const rate = function (session, movieId, userId, rating) {
  return session.writeTransaction(txc =>
    txc.run(
      'MATCH (u:User {id: $userId}),(m:Movie {tmdbId: $movieId}) \
      MERGE (u)-[r:RATED]->(m) \
      SET r.rating = $rating \
      RETURN m',
      {
        userId: userId,
        movieId: movieId,
        rating: parseInt(rating)
      }
    )
  );
};

const deleteRating = function (session, movieId, userId) {
  return session.writeTransaction(txc =>
    txc.run(
      'MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie {tmdbId: $movieId}) DELETE r',
      {userId: userId, movieId: movieId}
    )
  );
};

const getRatedByUser = function (session, userId) {
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (:User {id: $userId})-[rated:RATED]->(movie:Movie) \
       RETURN DISTINCT movie, rated.rating as my_rating',
      {userId: userId}
    )
  ).then(result => {
    return result.records.map(r => new Movie(r.get('movie'), r.get('my_rating')))
  });
};

const getRecommended = function (session, userId) {
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (me:User {id: $userId})-[my:RATED]->(m:Movie) \
      MATCH (other:User)-[their:RATED]->(m) \
      WHERE me <> other \
      AND abs(my.rating - their.rating) < 2 \
      WITH other,m \
      MATCH (other)-[otherRating:RATED]->(movie:Movie) \
      WHERE movie <> m \
      WITH avg(otherRating.rating) AS avgRating, movie \
      RETURN movie \
      ORDER BY avgRating desc \
      LIMIT 25',
      {userId: userId}
    )
  ).then(result => manyMovies(result));
};
*/
