const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const articleSchema = new Schema({
	title: {
		type: String
	},
	link: {
		type: String
	},
	description: {
		type: String
	},
	imageLink: {
		type: String
	},
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	],
	saved: {
		type: Boolean,
		default: false
	}
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
