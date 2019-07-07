const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const db = require("./models");
const PORT = 3000;

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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/3000";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/scaper_db", {
// 	useNewUrlParser: true
// });

app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});
