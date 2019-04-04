'use strict';


// dependencies
// =============================================================
const express = require('express'),
      exphbs = require('express-handlebars'),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override');

// set up express app
// =============================================================
const PORT = process.env.PORT || 8000;
let app = express();

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended:true }))
    .use(bodyParser.text())
    .use(bodyParser.json({ type: 'application/vnd.api+json' }))
    .use(methodOverride('_method'))
    .use(logger('dev'))
    .use(express.static(__dirname + '/public'))
    .engine('handlebars', exphbs({ defaultLayout: 'main' }))
    .set('view engine', 'handlebars')
    .use(require('./controllers'));

// configure mongoose and start the server
// =============================================================
// set mongoose to leverage promises
mongoose.Promise = Promise;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsArticles";

// Database configuration with mongoose
mongoose.set('useCreateIndex', true)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds145415.mlab.com:45415/heroku_bzh0wq4x");

const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
    // start the server, listen on port 8000
    app.listen(PORT, function() {
        console.log("App running on port http://localhost:" + PORT);
    });
});

module.exports = app;
    
