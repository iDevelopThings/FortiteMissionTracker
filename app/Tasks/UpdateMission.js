'use strict';

const Task            = use('Task');
const FortniteManager = use('App/Services/FortniteManager');

const Cache         = use('Cache');
const Mission       = use('App/Models/Mission');
const MissionReward = use('App/Models/MissionReward');
const Conversions   = use('App/Services/FortniteConversions');
const collect       = require('collect.js');

class UpdateMission extends Task {

  static get schedule()
  {
    return '0 0 * * *';
  }

  async handle()
  {
    let fortniteManager = new FortniteManager();

    await fortniteManager.updateSavedMissions();

    console.log('Successfully updated missions.');
  }
}

module.exports = UpdateMission;
