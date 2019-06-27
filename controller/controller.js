const db = require("../models");

//When scrape button is clicked, grab ten articles from the db
exports.fetchArticles = function(req, res, next) {
	db.Article.find({})
		.then(dbArticles => {
			let twelveArticles = dbArticles.filter((article, index) => {
				if (index > 9 && index < 22) return article;
			});
			res.render("index", {
				articles: twelveArticles
			});
		})
		.catch(err => {
			res.json(err);
		});
};

//Get articles with saved: true from the database then render the saved page
exports.fetchSavedArticles = function(req, res, next) {
	db.Article.find({ saved: true })
		.populate("notes")
		.then(savedArticles => {
			res.render("saved", {
				saved: savedArticles
			});
		})
		.catch(err => {
			res.json(err);
		});
};

//When user clicks save change saved for that article to true
exports.saveArticle = function(req, res, next) {
	db.Article.findByIdAndUpdate(
		{ _id: req.params.id },
		{ saved: true },
		{ useFindAndModify: false }
	).then(savedArticle => {
		res.json(savedArticle);
	});
};

//When user clicks delete update saved for that article to false
exports.deleteArticle = function(req, res, next) {
	db.Article.findByIdAndUpdate(
		{ _id: req.params.id },
		{ saved: false },
		{ useFindAndModify: false }
	)
		.then(deletedArticle => {
			res.json(deletedArticle);
		})
		.catch(err => {
			res.json(err);
		});

	exports.saveNote = function(req, res, next) {
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
	};
};
