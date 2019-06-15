const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/scrape", function(req, res) {
		axios.get("https://www.theguardian.com/us").then(function(response) {
			const $ = cheerio.load(response.data);
			const result = {};

			$(".js-headline-text").each(function(i, element) {
				// result.imageLink = $(element).attr("src");
				console.log(element.attribs);
				// db.Article.create(result)
				// 	.then(dbarticle => {
				// 		console.log(dbarticle);
				// 	})
				// 	.catch(err => {
				// 		console.log(err);
				// 	});
				// console.log(result.imageLink)
				return i < 5;
			});
		});
	});
};
