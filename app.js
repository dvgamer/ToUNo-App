"use strict";
const app 		= require('express')();
const cors 		= require('cors');
const moment  = require('moment');
const chalk   = require('chalk');
const cron 		= require('cron');
const request = require('request');
const bodyParser = require('body-parser');
const port		= 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth/anilist', require('./route/anilist'));


// app.get('/poke-map/:id/:name/:lat/:lng', (req, res) => {
// 	let param = req.params; // { id: '1', name: 'aaa', lat: '1', lng: '1' }
// 	let noti = {
//     channel: "#poke-map", 
//     username: param.name, 
//     icon_url: `http://dev.ns.co.th:810/static/icons/${param.id}.png`,
//     text: `At \`${param.lat}\`,\`${param.lng}\``
//   }

// 	request.post({
// 		url:'https://hooks.slack.com/services/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', 
// 		form: {
// 			payload: JSON.stringify(noti)
// 		}
// 	}, function(err,httpResponse,body){
// 	  res.send(JSON.stringify({ status: err ? false : true }));
// 	})
  
// });


// app.use('/travox', [], require("./route/travox-sentinel"));

// app.get('/', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ server: 'online', online: true }));
// });


// app.get('/', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ server: 'online' }));
// });


app.listen(port, () => {
  console.log(`Server OAuth 2.0 at ${moment().format("HH:mm:ss")} Started`);
});

// SIGINT, SIGTERM, and SIGKILL
// process.on('SIGINT', () => {
//   console.log(`Server OAuth 2.0 at ${moment().format("HH:mm:ss")} Shutdown...`);
//   process.exit();
// }); 

// process.on('SIGTERM', () => {
//   console.log(`Server OAuth 2.0 at ${moment().format("HH:mm:ss")} Restarting...`);
//   process.exit();
// }); 

// process.on('SIGKILL', () => {
//   console.log(`Server OAuth 2.0 at ${moment().format("HH:mm:ss")} Restarting...`);
//   process.exit();
// }); 