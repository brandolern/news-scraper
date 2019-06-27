const db = require("../models");
// const axios = require("axios");
// const cheerio = require("cheerio");
const controller = require("../controller/controller");

module.exports = function(app) {
	/////// PAGE ROUTES/////////
	app.get("/", function(req, res) {
		res.render("index");
	});
	app.get("/saved", function(req, res) {
		res.render("saved");
	});

	/////// API ROUTES/////////
	app.get("/api/scrape", controller.scrape, function(req, res) {
		res.send("Scrape Complete");
	});
	app.get("/api/articles", controller.fetchArticles);

	app.get("/api/articles/:id", function(req, res) {
		db.Article.find({ _id: req.params.id })
			.populate("notes")
			.then(dbArticle => {
				res.json(dbArticle);
			})
			.catch(err => {
				res.json(err);
			});
	});

	app.post("/api/articles/:id", function(req, res) {
		db.Note.create(req.body)
			.then(function(dbNote) {
				return db.Article.updateOne(
					{ _id: req.params.id },
					{ notes: dbNote._id },
					{ new: true }
				);
			})
			.then(function(dbNote) {
				res.json(dbNote);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
};
