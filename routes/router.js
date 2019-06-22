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
		axios
			.get("https://www.huffpost.com/section/us-news")
			.then(function(response) {
				const $ = cheerio.load(response.data);
				ids = [];
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
								ids.push(dbArticle._id);
							})
							.catch(err => {
								res.json(err);
							});
					}
				});
				res.send("Added 10 articles!");
			});
	});

	// if (ids.length === 19) {
	// 	function secondScrape() {
	// 		let counter = 0;

	// 		$(".card__image").each(function(index, element) {
	// 			if (index < 5) return;
	// 			else {
	// 				secondScrapeResults.push(
	// 					$(this)
	// 						.children("img")
	// 						.attr("alt")
	// 				);

	// 				secondScrapeResults.push(
	// 					$(this)
	// 						.children("img")
	// 						.attr("src")
	// 				);
	// 			}
	// 		});
	// 	}
	// }

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

// db.Article.findOneAndUpdate(
// 	{_id: dbArticle._id},
// 	{
// 		description: secondScrapeResults[i],
// 		imageLink: secondScrapeResults[i + 1]
// 	},
// 	{
// 		new: true
// 	}
// )
// 	.then(dbUpdate => {
// 		console.log(dbUpdate);
// 	})
// 	.catch(err => {
// 		res.json(err);
// 	});
