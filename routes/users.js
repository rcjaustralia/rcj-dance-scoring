"use strict"
const Promise = require('bluebird');
const bcrypt = require("bcrypt-as-promised");
const model = require('../model');

exports.list = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		return model.User.run();
	}).then((users) => {
		console.log("USERS", users);
		let results = [];
		for ( var i = 0; i < users.length; i++ ){
			results.push(users[i].toJson())
		}
		res.send(results);
		return res.end();
	}).catch((err) => {
		res.send(500);
		return res.end();
	})
}

exports.login = function(req, res){
	return Promise.try(() => {
		if (( req.body.username == null ) && ( req.body.password == null )){
			throw new Error("Bad Request");
		}
		let r = model.thinky.r;
		return model.User
		.filter(r.row("username").eq(req.body.username))
		.run()
	}).then((results) => {
		if (results.length === 1) {
			return results;
		}
		let r = model.thinky.r;
		return r.db("rcja").table("User").count().then((count) => {
			if (count === 0) {
				//create an admin user with the supplied creds
				return bcrypt.hash(req.body.password, 10)
				.then((hash) => {
					let userObj = {
						name: "Admin User",
						username: req.body.username,
						password: hash
					}
					let user = new model.User(userObj);
					return user.save()
				}).then((user) => {
					return [user];
				})
			}
			throw new Error("Not Found");
		})	
	}).then((results) => {
		let user = results[0];
		return bcrypt.compare(req.body.password, user.password)
		.then(() => {
			return user;
		})
	}).then((user) => {
		res.cookie('rcjaCookie', user.id);
		res.redirect('/index.html');
		return res.end();
	}).catch(bcrypt.MISMATCH_ERROR, () => {
		res.send(401);
		return res.end();
	}).catch((err) => {
		console.log(err);
		if (err.message === "Bad Request") {
			res.send(400);
		} else {
			res.redirect('/login.html');
		}
		return res.end();
	})
}

exports.logout = function(req, res){
	return Promise.try(() => {
		res.cookie.rcjaCookie = null;
		res.redirect('/login.html');
		return res.end();
	}).catch((err) => {
		res.send(500);
		return res.end();
	})
}

exports.create = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		return bcrypt.hash(req.body.password, 10);
	}).then((hash) => {
		let userObj = {
			name: req.body.name,
			username: req.body.username,
			password: hash
		}
		let user = new model.User(userObj);
		return user.save()
	}).then((savedUser) => {
		res.send(JSON.stringify(savedUser.toJson()));
		return res.end();
	}).catch((err) => {
		res.send(500);
		return res.end();
	})
}

exports.modify = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		if (req.body.password) {
			return bcrypt.hash(req.body.password, 10);
		} else {
			return null;
		}
		
	}).then((hashedPassword) => {
		return model.User.get(req.params.userId)
		.then((user) => {
			return [user, hashedPassword];
		})
	}).spread((user, hashedPassword) => {
		user.name = req.body.name;
		user.username = req.body.username;
		return user.save();
	}).then((savedUser) => {
		res.send(JSON.stringify(user.toJson()));
		return res.end();
	}).catch((err) => {
		res.send(500);
		return res.end();
	})
}

exports.currentUser = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(req.currentUser));
		res.end();
	})
}