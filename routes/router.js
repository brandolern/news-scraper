const controller = require("../controller/controller");
const scraperController = require("../controller/scraperController");

module.exports = function(app) {
	/////// SCRAPE ROUTE/////////
	app.get("/scrape", scraperController.scrape);

	/////// PAGE ROUTES/////////
	app.get("/", function(req, res) {
		res.render("index");
	});
	app.get("/saved", controller.fetchSavedArticles);

	/////// API ROUTES/////////
	app.get("/api/articles", controller.fetchArticles);
	app.put("/api/articles/:id/save", controller.saveArticle);
	app.put("/api/articles/:id/delete", controller.deleteArticle);
	app.get("/api/articles/:id", controller.getArticleNotes);
	app.post("/api/articles/:id/note", controller.saveNote);
};
