const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

//Scrapes then adds article titles and links to database. Then grabs all _ids from database,
// loops through scrape data for images and descriptions, and updates those ids with the corresponding image/description
exports.scrape = function(req, res, next) {
	axios.get("https://www.huffpost.com/section/us-news").then(response => {
		const $ = cheerio.load(response.data);
		let articleIds = [];

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
					.then(dbArticle => {})
					.catch(err => {
						res.json(err);
					});
			}
		});

		const firstScrapeFinished = setInterval(() => {
			getArticleIds(() => {
				secondScrape();
			});
			clearInterval(firstScrapeFinished);
		}, 3000);

		const getArticleIds = cb => {
			db.Article.find({}).then(result => {
				result.map(article => {
					articleIds.push(article._id);
				});
				cb();
			});
		};

		const secondScrape = () => {
			$(".card__image").each(function(index, element) {
				let result = {};

				result.description = $(this)
					.children("img")
					.attr("alt");
				if (result.description === "") {
					result.description = "No Description";
				}
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
						next();
					})
					.catch(err => {
						res.json(err);
					});
			});
		};
	});
};

//When scrape button is clicked, grab ten articles from the db
exports.fetchArticles = function(req, res, next) {
	db.Article.find({})
		.then(dbArticles => {
			let tenArticles = dbArticles.filter((article, index) => {
				if (index > 9 && index < 22) return article;
			});
			res.render("index", {
				articles: tenArticles
			});
		})
		.catch(err => {
			res.json(err);
		});
};
