"use strict";
const express = require('express');
const router  	= express.Router();
const moment  	= require('moment');
const Q  				= require('q');
const assert  	= require('assert');
const request 	= require('request');
const mongo  		= require('../mongo/schema');
const bodyParser = require('body-parser')

const uri = {
	access_token: 'https://github.com/login/oauth/access_token',
	access_redirect: 'https://oauth.touno-k.com/travox/token'
}
const auth = {
	client_id: 'bcd775879aa7da09520c',
	client_secret: '060f960e69a83afe64a4774868b549d0b95ec745'
}

// let commited = new mongo.OAuth({ state: 'AUTH' });
// commited.save(function (err, result) { console.log(err, result);	}); 

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/', function(req, res){
	let query = req.query;

	(function(){
		var def = Q.defer();

		console.log(`[${query.state}] Step 1 -- verify auth`);
		mongo.OAuth.findOne({ _id: query.state, state: 'AUTH' }, function(err, token){ 
			if(err) ef.reject(err);
			if(token) {
				mongo.OAuth.update({ _id: query.state }, { $set: { state: 'TOKEN' } }, function(err){
					if(err) ef.reject(err);
					def.resolve(); 
				});
			} else {
				def.reject('token in mongo is null');
			}
		});
		return def.promise;
	})().then(function(token){
		var def = Q.defer();
		console.log(`[${query.state}] Step 2 -- verify access_token`);

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
		}, function (err, r, body) {
			if(body.access_token) {

				// // SUCCCESS CASE
				// access_token: '1391947df749cf29a3d87daf60ab77513ac0615a',
				// token_type: 'bearer',
				// scope: 'repo,user'
				console.log(`[${query.state}] Step 3 -- access_token (${body.access_token})`);
  			mongo.OAuth.update({ _id: query.state }, { 
  				$set: {
						state: 'PASS',
						access_token: body.access_token,
						token_type: body.token_type,
						scope: body.scope
					} 
  			}, function(err){ if(err) ef.reject(err); });

			} else {

				// // ERROR CASE
				// error: 'bad_verification_code',
				// error_description: 'The code passed is incorrect or expired.',
				// error_uri: 'https://developer.github.com/v3/oauth/#bad-verification-code'
				console.log(`[${query.state}] Step 3 -- ${body.error_description}`);
  			mongo.OAuth.update({ _id: query.state }, { 
  				$set: {
						state: 'ERROR',
						error: body.error,
						error_description: body.error_description
					} 
  			}, function(err){ if(err) ef.reject(err); });
			}
	  	res.end();
		});
		return def.promise;
	}).catch(function(ex){
		console.log(`[${query.state}] Step catch -- ${ex}`);
  	res.end(); 
	});

	//https://github.com/login/oauth/access_token
	// console.log(query.code, query.state);
});

router.get('/token', function(req, res){
	res.end();
});

module.exports = router;