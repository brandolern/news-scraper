const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/scrape", function(req, res) {
		axios
			.get("https://www.huffpost.com/section/us-news")
			.then(function(response) {
				const $ = cheerio.load(response.data);

				$(".card__link").each(function(index, element) {
					let result = {};
					if (index < 5) return;
					else {
						let title = $(this)
							.children("div")
							.text();

						result.title = title.substring(1, title.length - 1);
						result.link = $(this).attr("href");

						db.Article.create(result)
							.then(dbArticle => {
								console.log(dbArticle);
							})
							.catch(err => {
								res.json(err);
							});
					}
				});

				// function secondScrape() {
				// 	let counter = 0;

				// 	$(".card__image").each(function(index, element) {
				// 		if (index < 5) return;
				// 		else {
				// 			secondScrapeResults.push(
				// 				$(this)
				// 					.children("img")
				// 					.attr("alt")
				// 			);

				// 			secondScrapeResults.push(
				// 				$(this)
				// 					.children("img")
				// 					.attr("src")
				// 			);
				// 		}
				// 	});
				// }

				// db.Article.updateOne(
				// 	dbArticle._id,
				// 	{
				// 		description: secondScrapeResults[i],
				// 		imageLink: secondScrapeResults[i + 1]
				// 	},
				// 	{
				// 		upsert: true
				// 	}
				// )
				// 	.then(dbUpdate => {
				// 		console.log(dbUpdate);
				// 	})
				// 	.catch(err => {
				// 		res.json(err);
				// 	});
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
			.then(function(dbUser) {
				res.json(dbUser);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
};
