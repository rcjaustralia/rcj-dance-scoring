"use strict"
const thinky = require('./thinky');
const uuid = require('node-uuid');
const type = thinky.type;
const Team = thinky.createModel("Team", {
  id: type.string().uuid(4).default(uuid.v4),
  name: type.string().required(),
  school: type.string(),
  division: type.string().uuid(4).required()
})

Team.define('toJson', function() {
  let hash = {
    id: this.id,
    name: this.name,
    division: this.division
  }
  if ( this.school != null ){
    hash.school = this.school;
  }
  if (this.divisionObj) {
    hash.division = this.divisionObj.toJson();
  }
  return hash;
})

Team.ensureIndex("division");

module.exports = Team;