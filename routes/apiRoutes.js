const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/scrape", function(req, res) {
		axios.get("https://www.amazon.com/gp/goldbox").then(response => {
			let $ = cheerio.load(response.data);
		});
	});
};
