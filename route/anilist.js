"use strict";
const express = require('express');
const router  	= express.Router();
const moment  	= require('moment');
const request 	= require('request-promise');
const qs 				= require('querystring');
const mongo  		= require('../mongo/schema');

router.get('/', (req, res) => {
	let body = req.body, param = req.params, query = req.query;
	let grant = {
		grant_type		: 'authorization_code',
		client_id			: process.env.ANILIST_ID||'touno-o6qpv',
		client_secret	: process.env.ANILIST_SECRET||'3nWz2gnUm4iXpAVzKKRNgByQ6oXq',
		response_type	: 'code',
		redirect_uri	: `https://${process.env.VIRTUAL_HOST||'auth.touno.co'}/auth/anilist`
	}

	if(!query.code) {
		console.log(`[Anilist.co] Step 00 -- authorize`);
		res.redirect(`https://anilist.co/api/auth/authorize?${qs.stringify(grant)}`);
	} else {
		console.log(`[Anilist.co] Step 01 -- verify ${query.code}`);
		grant.code = query.code;
		delete grant.response_type;

		request({
			method: 'POST',
			uri: `https://anilist.co/api/auth/access_token`, 
		  form: grant,
		  json: true
		}).then(data => {
			return mongo.OAuth.findOne({ 
				name: 'anilist.co'
			}).then((item)=>{
				let commited = {
				  name: 'anilist.co',
				  client_id: `${grant.client_id}|${grant.client_secret}`,
				  access_token: data.access_token,
				  state: null,
				  scope: data		
				}
				console.log(`[Anilist.co] Step 02 -- ${!item?'Saved':'Updated'} ${data.access_token}`);
				return !item ? new mongo.OAuth(commited).save() : mongo.OAuth.update({_id:item._id},{$set:commited});
			});

		}).then(() => {
			res.redirect('https://anilist.co/');
		}).catch(err => {
			console.log(`[Anilist.co] ERROR`);
			res.redirect(grant.redirect_uri);
		});
	}
});


// let commited = new mongo.OAuth({ state: 'AUTH' });
// commited.save(function (err, result) { console.log(err, result);	}); 

module.exports = router;