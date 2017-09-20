"use strict"
const thinky = require('./thinky');
const uuid = require('node-uuid');
const type = thinky.type;
const User = thinky.createModel("User", {
	id: type.string().uuid(4).default(uuid.v4),
	name: type.string().required(),
	username: type.string().required(),
	password: type.string().required(),
	isAdmin: type.boolean().default(false).required()
});

User.define('toJson', function() {
	var hash = {
		id: this.id,
		name: this.name,
		username: this.username,
	}
	if (this.isAdmin === undefined) {
		hash.isAdmin = false;
	} else {
		hash.isAdmin = this.isAdmin;
	}
	return hash;
})

module.exports = User;