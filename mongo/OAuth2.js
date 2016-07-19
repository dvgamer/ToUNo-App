const mongoose 	= require('mongoose');

mongoose.connect('mongodb://touno-k.com:27017/sessions');

const Schema = {
	OAuth: mongoose.Schema({
	  repository_id: Number,
	  author: String,
	  email: String,
		subject: String,
		comment: String,
		logs: Boolean,
	  since: Date
	})
}


module.exports = {
	OAuth: mongoose.model('oauth-3rd', Schema.OAuth),
}