const mongoose 	= require('mongoose');

mongoose.connect('mongodb://touno-k.com:27017/sessions');

const Schema = {
	OAuth: mongoose.Schema({
	  code: String,
	  client_id: String,
	  access_token: String,
	  token_type: String,
	  state: String,
	  scope: String,
  	error: String,
  	error_description: String
	})
}

module.exports = {
	OAuth: mongoose.model('oauth-3rd', Schema.OAuth),
}