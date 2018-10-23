//dependencies
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = 1337;

//const app to use express
const app = express();

//express json parse, static public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


//mongoose db connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscrape";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//handlebars
const exphbs = require("express-handlebars");

app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// import routes
const routes = require("./controllers/controller.js");

app.use(routes);

app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});


