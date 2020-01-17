'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Mission extends Model {

  rewards()
  {
    return this.hasMany('App/Models/MissionReward');
  }

  modifiers()
  {
    return this.hasMany('App/Models/MissionModifier');
  }

}

module.exports = Mission;
