'use strict';

const FortniteManager = use('App/Services/FortniteManager');

const Cache         = use('Cache');
const Mission       = use('App/Models/Mission');
const MissionReward = use('App/Models/MissionReward');
const Conversions   = use('App/Services/FortniteConversions');
const UpdateMission = use('App/Tasks/UpdateMission');
const collect       = require('collect.js');

class FortniteController {

  async rewards({request, response})
  {
    let conversions = Conversions;

    conversions.missions = collect(Conversions.missions)
      .filter(mission => {
        return mission.type !== 'msk';
      })
      .map(mission => {
        let m = mission;
        delete m.maps;
        return m;
      }).toArray();

    conversions.rewards = collect(Conversions.rewards)
      .filter(reward => {
        return reward.item_reward === undefined && reward.npc === undefined;
      }).toArray();

    return response.json(conversions);

  }

  async view({request, response})
  {
    let fortniteManager = new FortniteManager();

    const fortniteToken = await Cache.get('fortniteToken');
    if (fortniteToken) {
      fortniteManager.setToken(fortniteToken);
    } else {
      let token = await fortniteManager.login();
      await Cache.put('fortniteToken', token, 60);
    }

    let missions = await fortniteManager.getLatestMissions();

    return response.json(missions);

  }

  async store({request, response})
  {
    try {
      let fortniteManager = new FortniteManager();

      await fortniteManager.updateSavedMissions();
    } catch (e) {
      console.error(e);
      return response.status(500).json(e);
    }

    console.log('Successfully updated missions.');
    return response.json({message : 'Done'});
  }

  async missions({request, response})
  {
    let missions = await Mission.query()
      .with('rewards')
      .where(builder => {

        if (request.input('maps')) {
          let maps = request.input('maps').split(',');
          builder.whereIn('type', maps);
        }

        if (request.input('double_rewards')) {
          builder.whereHas('rewards', query => {
            return query.where('alert_reward', 0).where('quantity', '>', 1);
          });
        }

        if (request.input('special_rewards')) {
          builder.where('is_special', 1);
        }
        if (request.input('rewards')) {
          builder
            .whereHas('rewards', query => {
              let rewards = request.input('rewards').split(',');
              query.whereIn('slug', rewards);
            });
        }
      })
      .orderBy('tile_index', 'asc')
      .fetch();

    return response.json(missions);
  }

  async missionsByType({request, response, params})
  {
    if (!params.type) {
      return response.status(500).json({message : 'Please specify a type of mission.'});
    }

    let missions = await Mission.query()
      .orderBy('tile_index', 'asc')
      .where('type', params.type)
      .with('rewards')
      .fetch();

    return response.json(missions);
  }

  async missionsContainingReward({request, response, params})
  {
    if (!params.type) {
      return response.status(500).json({message : 'Please specify a type of reward.'});
    }

    let missions = await Mission.query()
      .orderBy('tile_index', 'asc')
      .with('rewards')
      .whereHas('rewards', query => {
        query.where('slug', params.type);
      })
      .fetch();

    return response.json(missions);
  }
}

module.exports = FortniteController;
