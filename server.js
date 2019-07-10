const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const db = require("./models");
const PORT = process.env.PORT || 3000;

const app = express();
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));

app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
);
app.use(express.static("public"));
app.set("view engine", "handlebars");

require("./routes/router.js")(app);

// app.use(express.urlencoded({ extended: true }));

mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost3000/scaper_db",
	{ useNewUrlParser: true }
);
// mongoose.connect("mongodb://localhost/scaper_db", {
// 	useNewUrlParser: true
// });

app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});

// heroku config: set MONGOLAB_URI = mongodb://username:password@ds01316.mlab.com:1316/food
