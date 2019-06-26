const db = require("../models");

module.exports = {
	scrape() {
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
	}
};
