const db = require("../models");
// const axios = require("axios");
// const cheerio = require("cheerio");
const controller = require("../controller/controller");

module.exports = function(app) {
	/////// PAGE ROUTES/////////
	app.get("/", function(req, res) {
		res.render("index");
	});
	app.get("/saved", controller.fetchSavedArticles);

	/////// API ROUTES/////////
	app.get("/api/scrape", controller.scrape);
	app.get("/api/articles", controller.fetchArticles);
	app.put("/api/articles/:id/save", controller.saveArticle);
	app.put("/api/articles/:id/delete", controller.deleteArticle);
	app.post("/api/articles/:id", controller.saveNote);
};
