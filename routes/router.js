const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/", function(req, res) {
		res.render("index");
	});
	app.get("/saved", function(req, res) {
		res.render("saved");
	});
	app.get("/scrape", function(req, res) {
		axios.get("https://www.huffpost.com/section/us-news").then(response => {
			const $ = cheerio.load(response.data);
			let articleIds = [];
			let articleLength = 0;

			$(".card__link").each(function(index, element) {
				let result = {};
				if (index < 5) return;
				else {
					articleLength++;
					let title = $(this)
						.children("div")
						.text();

					result.title = title.substring(1, title.length - 1);
					result.link = $(this).attr("href");

					db.Article.create(result)
						.then(dbArticle => {
							console.log(result);
							articleIds.push(dbArticle._id);
						})
						.catch(err => {
							res.json(err);
						});
				}
			});
			const firstScrapeFinished = setInterval(() => {
				if (articleIds.length === articleLength) {
					secondScrape();
					clearInterval(firstScrapeFinished);
				}
			}, 1000);

			const secondScrape = () => {
				$(".card__image").each(function(index, element) {
					let result = {};
					// if (index < 5) return;
					// else {
					result.description = $(this)
						.children("img")
						.attr("alt");

					result.imageLink = $(this)
						.children("img")
						.attr("src");

					db.Article.updateOne(
						{ _id: articleIds[index] },
						{
							description: result.description,
							imageLink: result.imageLink
						}
					)
						.then(dbUpdate => {
							console.log(dbUpdate);
						})
						.catch(err => {
							res.json(err);
						});
					// }
				});
			};
		});
	});

	app.get("/articles", function(req, res) {
		db.Article.find({})
			.then(function(dbArticles) {
				let tenArticles = dbArticles.filter(article => {
					if (dbArticles.indexOf(article) < 10) {
						return article;
					}
				});
				console.log(tenArticles);
				res.render("index", {
					articles: tenArticles
				});
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
			.then(function(dbNote) {
				res.json(dbNote);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
};
