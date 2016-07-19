"use strict";

const express = require('express');
const router  	= express.Router();
const moment  	= require('moment');
const assert  	= require('assert');
const request 	= require('request');
const mongo  		= require('./mongo/schema');
const uri = {
	access_token: 'https://github.com/login/oauth/access_token',
	access_redirect: 'https://oauth.touno-k.com/travox/access_token'
}

const auth = {
	client_id: 'bcd775879aa7da09520c',
	client_secret: '060f960e69a83afe64a4774868b549d0b95ec745'
}
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

	request.post(uri.access_token, {
	  form: {
	    client_id: auth.client_id,
	    client_secret: auth.client_secret,
	    code: query.code,
	    redirect_uri: auth.access_redirect,
	    state: query.state
	  },
	  json: true
	}, function (err, res, body) {
	  console.log(body);
	  console.log();
	  console.log(assert.equal(typeof body, 'object'));
	})



	//https://github.com/login/oauth/access_token
	// console.log(query.code, query.state);
  res.end();
});

router.get('/access_token', function(req, res){
	res.end();
});

module.exports = router;