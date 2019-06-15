const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	image_link: {
		type: String,
		required: true
	},
	rating: {
		type: String,
		required: true
	},
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	]
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
