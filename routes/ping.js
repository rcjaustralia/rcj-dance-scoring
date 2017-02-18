"use strict"
const Promise = require('bluebird');

exports.ping = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		res.send({"ping":"pong"});
		return res.end();
	}).catch((err) => {
		console.log(err);
		res.send(500);
		return res.end();
	})
}
