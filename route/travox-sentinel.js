"use strict";

const express = require('express');
const router  	= express.Router();
const moment  	= require('moment');
const assert  	= require('assert');
const request 	= require('request');
const   		= require('./mongo/OAuth2');
// const config  = require('$custom/config');
// const control = require("$custom/touno-git").control;
// const db      = require("$custom/mysql").connect();

router.get('/', function(req, res){
	let query = req.query;

	// Step 1
	// Parameters
	// client_id			string	Required. The client ID you received from GitHub when you registered.
	// client_secret	string	Required. The client secret you received from GitHub when you registered.
	// code						string	Required. The code you received as a response to Step 1.
	// redirect_uri		string	The URL in your application where users will be sent after authorization. See details below about redirect urls.
	// state					string	The unguessable random string you optionally provided in Step 1.

	request.post('https://github.com/login/oauth/access_token', {
	  form: {
	    client_id: '...',
	    client_secret: 'refresh_token',
	    code: '...',
	    redirect_uri: '...',
	    state: '...'
	  },
	  json: true
	}, function (err, res, body) {
	  // assert.equal(typeof body, 'object')
	})



	//https://github.com/login/oauth/access_token
	// console.log(query.code, query.state);
  res.end();
});

module.exports = router;