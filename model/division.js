"use strict"
const thinky = require('./thinky');
const uuid = require('node-uuid');
const type = thinky.type;

const Division = thinky.createModel("Division", {
  id: type.string().uuid(4).default(uuid.v4),
  category: type.string().required(),
  name: type.string().required(),
  interviewSheetTemplate: type.string().uuid(4),
  performanceSheetTemplate: type.string().uuid(4),
  open: type.boolean().required().default(true),
  rounds: type.array().schema({
    id: type.string().uuid(4).default(uuid.v4),
    order: type.number().required(),
    isFinal: type.boolean().default(false).required(),
    customName: type.string()
  }).default([])
});

Division.define('toJson', function() {
  var hash = {
    id: this.id,
    name: this.name,
    category: this.category,
    rounds: [],
    open: this.open
  }
  if ( this.interviewSheetTemplate ){
    hash.interviewSheetTemplate = this.interviewSheetTemplate;
  }
  if ( this.performanceSheetTemplate ){
    hash.performanceSheetTemplate = this.performanceSheetTemplate;
  }
  for ( var i = 0; i < this.rounds.length; i++ ){
    let round = this.rounds[i]
    let roundHash = {
      id: round.id,
      order: round.order,
      isFinal: round.isFinal
    }
    if ( round.customName != null ){
      roundHash.customName = round.customName;
      roundHash.name = round.customName;
    }else{
      if ( round.isFinal ){
        roundHash.name = 'Final ' + round.order.toString()
      }else{
        roundHash.name = 'Round ' + round.order.toString()
      }
    }
    hash.rounds.push(roundHash);
  }
  return hash;
})

module.exports = Division;