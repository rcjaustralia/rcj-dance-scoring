"use strict"
const thinky = require('./thinky');
const uuid = require('node-uuid');
const type = thinky.type;
const User = thinky.createModel("User", {
	id: type.string().uuid(4).default(uuid.v4),
	name: type.string().required(),
	username: type.string().required(),
	password: type.string().required()
});

User.define('toJson', function() {
	var hash = {
		id: this.id,
		name: this.name,
		username: this.username
	}
	return hash;
})

module.exports = User;