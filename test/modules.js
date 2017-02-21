"use strict";

var walk = require('walk')
  , walker
  ;

walker = walk.walk("F:\\Anime Store-Uncheck4", {});

walker.on("file", function (root, file, next) {
  // fs.readFile(file.name, function () {
    // doStuff \
	  let item = {
	  	uid: file.uid,
	  	name: file.name,
	  	size: file.size,
	  	ctime: file.ctime
	  }
    console.log(`${root}\\${file.name}`)
    next();
  // });
});

walker.on("errors", function (root, nodeStatsArray, next) {
  next();
});

walker.on("end", function () {
  console.log("all done");
});