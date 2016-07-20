"use strict";
// oauth.touno-k.com/sentinel?code=bb42f3a8f7298cd65d7d&state=xxxx

const express = require('express')();
const http 		= require("http").createServer(express);
const moment  = require('moment');
const chalk   = require('chalk');
const cron 		= require('cron');
const port		= 8450;

express.use('/travox', [], require("./route/travox-sentinel"));

express.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ server: 'online' }));
});

http.listen(port, () => {
  console.log(`Server OAuth 2.0 [0.0.0.0:${port}] at ${moment().format("HH:mm:ss")} Started`);
});

// SIGINT, SIGTERM, and SIGKILL
process.on('SIGTERM', (code) => {
  console.log(`Server OAuth 2.0 Shutdown (${code})...`);
  console.log(`Server OAuth 2.0 at ${moment().format("HH:mm:ss")} Restarting...`);
});