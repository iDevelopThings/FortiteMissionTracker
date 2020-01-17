'use strict';

const FortniteManager = use('App/Services/FortniteManager');
const {Command}       = require('@adonisjs/ace');

class UpdateMission extends Command {
  static get signature()
  {
    return 'update:mission';
  }

  static get description()
  {
    return 'Tell something helpful about this command';
  }

  async handle(args, options)
  {
    try {
      let fortniteManager = new FortniteManager();

      await fortniteManager.updateSavedMissions();
    } catch (e) {
      throw e;
    }

    console.log('Successfully updated missions.');

    process.exit();
  }
}

module.exports = UpdateMission;
