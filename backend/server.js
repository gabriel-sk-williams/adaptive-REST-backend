// npm install --save neo4j-driver
// node server.js

/*
const neo4j = require('neo4j-driver')
const uri = 'bolt://localhost:7687/neo4j'
const user = 'gabers';
const password = 'localwebmaster';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();
*/

require("dotenv").config();
var express = require("express"),
    routes = require("./routes"),
    nconf = require("./config"),
    methodOverride = require("method-override"),
    setAuthUser = require("./middlewares/setAuthUser"),
    neo4jSessionCleanup = require("./middlewares/neo4jSessionCleanup");

var app = express();
var api = express();
    
app.use(nconf.get("api_path"), api);
app.set("port", nconf.get("PORT"));

// api.use(nconf.get("api_path"), api);
// api.set("port", nconf.get("PORT"));

api.use(methodOverride());
api.use(require("cors")());
api.use(require("body-parser").json());

//enable CORS
api.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// api custom middlewares:
// seems useful
api.use(setAuthUser);
api.use(neo4jSessionCleanup);

//api error handler
api.use(function (err, req, res, next) {
  if (err && err.status) {
    console.log(err);
    // writeError(res, err); <- imported from /helpers/response
  } else next(err);
});

// app.get( path, callback )
api.get("/hexagon/:subtype", routes.geometry.listHexagons);
api.get("/osm_point/:subtype", routes.geometry.listOSMPoints);
api.get("/transit_point/:subtype", routes.geometry.listTransitPoints);
api.get("/street/:subtype", routes.geometry.listStreets);
api.get("/transit_path/:subtype", routes.geometry.listTransitPaths);
api.get("/footway/:subtype", routes.geometry.listFootways);
api.get("/natural_path/:subtype", routes.geometry.listNaturalPaths);
api.get("/building/:subtype", routes.geometry.listBuildings);
api.get("/locale/:subtype", routes.geometry.listLocales);
api.get("/parking/:subtype", routes.geometry.listParking);
api.get("/block/:subtype", routes.geometry.listBlocks);
api.get("/parcel/:subtype", routes.geometry.listParcels);
api.get("/zoning/:subtype", routes.geometry.listZoning);
api.get("/graph/:subtype", routes.geometry.listGraphs);
api.get("/capacity/:subtype", routes.geometry.listCapacity);

api.get("/node/:hex", routes.node.getNodeByHex);
api.get("/lemma/:lemma", routes.node.getNodeByLemma);
api.get("/address/:address", routes.node.getNodeByAddress);
api.get("/name/:name", routes.node.getNodeByName);

api.listen(api.get("port"), () => {
  console.log("Express server listening on port " + api.get("port"));
});

// api.get("/movies/:id", routes.movies.findById);
// api.post("/movies/:id/rate", routes.movies.rateMovie);

//api error handler
/*
api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});
*/

//api routes
/*
api.post("/register", routes.users.register);
api.post("/login", routes.users.login);
api.get("/users/me", routes.users.me);
api.get("/movies", routes.movies.list);
api.get("/movies/recommended", routes.movies.getRecommendedMovies);
api.get("/movies/rated", routes.movies.findMoviesRatedByMe);

api.get("/movies/genre/:id", routes.movies.findByGenre);
api.get("/movies/daterange/:start/:end", routes.movies.findMoviesByDateRange);
api.get("/movies/directed_by/:id", routes.movies.findMoviesByDirector);
api.get("/movies/acted_in_by/:id", routes.movies.findMoviesByActor);
api.get("/movies/written_by/:id", routes.movies.findMoviesByWriter);

api.delete("/movies/:id/rate", routes.movies.deleteMovieRating);
api.get("/people", routes.people.list);
api.get("/people/:id", routes.people.findById);
api.get("/people/bacon", routes.people.getBaconPeople);
api.get("/genres", routes.genres.list);
*/


