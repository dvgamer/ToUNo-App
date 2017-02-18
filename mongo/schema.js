const mongoose 	= require('mongoose');
const MONGODB = process.env.MONGODB;

mongoose.connect(`mongodb://${MONGODB?MONGODB:'127.0.0.1:27017'}/db_touno`);
mongoose.Promise = global.Promise;

// mongoose.connect(`mongodb://${process.env.OAUTH_CONFIG?'mongodb':'touno-k.com'}:27017/sessions`);

const Schema = {
	OAuth: mongoose.Schema({
	  name: String,
	  client_id: String,
	  access_token: String,
	  state: String,
	  scope: Object
	})
}

module.exports = {
	OAuth: mongoose.model('oauth-3rd', Schema.OAuth),
}