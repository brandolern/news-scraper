const db = require("../models");
// const axios = require("axios");
// const cheerio = require("cheerio");
const controller = require("../controller/controller");
const scraperController = require("../controller/scraperController");

module.exports = function(app) {
	/////// SCRAPE ROUTE/////////
	app.get("/scrape", controller.scrape);

	/////// PAGE ROUTES/////////
	app.get("/", function(req, res) {
		res.render("index");
	});
	app.get("/saved", controller.fetchSavedArticles);

	/////// API ROUTES/////////
	app.get("/api/articles", controller.fetchArticles);
	app.put("/api/articles/:id/save", controller.saveArticle);
	app.put("/api/articles/:id/delete", controller.deleteArticle);
	app.post("/api/articles/:id", controller.saveNote);
};
