const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/scrape", function(req, res) {
		axios
			.get("https://www.huffpost.com/section/us-news")
			.then(function(response) {
				const $ = cheerio.load(response.data);

				let result = {};

				$(".card__link").each(function(index, element) {
					let title = $(this)
						.children("div")
						.text();

					result.title = title.substring(1, title.length - 1);
					result.link = $(this).attr("href");
				});

				$(".card__image").each(function(index, element) {
					result.description = $(this)
						.children("img")
						.attr("alt");

					result.imageLink = $(this)
						.children("img")
						.attr("src");
				});

				// db.Article.create(result)
				// 	.then(dbArticle => {
				// 		console.log(dbArticle);
				// 	})
				// 	.catch(err => {
				// 		console.log(err);
				// 	});
				res.send("Scrape Complete");
			});
	});

	app.get("/articles", function(req, res) {
		db.Article.find({})
			.then(dbArticles => {
				res.json(dbArticles);
			})
			.catch(err => {
				res.json(err);
			});
	});

	app.get("/articles/:id", function(req, res) {
		db.Article.find({ _id: req.params.id })
			.populate("notes")
			.then(dbArticle => {
				res.json(dbArticle);
			})
			.catch(err => {
				res.json(err);
			});
	});

	app.post("/articles/:id", function(req, res) {
		db.Note.create(req.body)
			.then(function(dbNote) {
				return db.Article.findOneAndUpdate(
					{ _id: req.params.id },
					{ notes: dbNote._id },
					{ new: true }
				);
			})
			.then(function(dbUser) {
				res.json(dbUser);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
};
