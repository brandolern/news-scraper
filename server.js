const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const db = require("./models");
const PORT = 3000;

const app = express();

require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes")(app);

app.use(logger("dev"));
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// const MONGODB_URI =
// 	process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connect("mongodb://localhost/scaper_db", {
	useNewUrlParser: true
});

app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});
