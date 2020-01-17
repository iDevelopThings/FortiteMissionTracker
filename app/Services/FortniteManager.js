const Env           = use('Env');
const EGClient      = require('epicgames-client').Client;
const FFF           = require('epicgames-fortnite-client');
const {ESubGame}    = FFF;
const axios         = require('axios');
const collect       = require('collect.js');
const Conversions   = require('./FortniteConversions');
const Cache         = use('Cache');
const Mission       = use('App/Models/Mission');
const MissionReward = use('App/Models/MissionReward');

class FortniteManager {

  constructor()
  {
    this.eg = new EGClient({
      email    : Env.get('FORTNITE_USERNAME'),
      password : Env.get('FORTNITE_PASSWORD'),
    });

    this.token = null;
  }

  setToken(token)
  {
    this.token = token;
  }

  async fixToken()
  {
    try {
      axios.defaults.headers.common['Authorization'] = `bearer ${this.token}`;
      let response                                   = await axios.get('https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/world/info');
      console.log('TOKEN IS FINE I THINK...');
      return response.data;
    } catch (e) {

      if (e.response && e.response.status === 401) {
        await Cache.forget('fortniteToken');
        console.log('CACHED FORTNITE TOKEN WAS CLEARED.');
        await this.login();
        console.log('TOKEN WAS UPDATED, NO ERRORS WOOP');
      } else
        throw e;
    }
  }

  login()
  {
    return new Promise((resolve, reject) => {
      this.eg.init().then(async (success) => {

        /**
         LogInit: Build: ++Fortnite+Release-11.40-CL-10993225
         LogInit: Engine Version: 4.24.0-10993225+++Fortnite+Release-11.40
         LogInit: Compatible Engine Version: 4.24.0-10981341+++Fortnite+Release-11.40
         LogInit: Net CL: 10482997
         */
        if (!success)
          return reject('Cannot initialize EpicGames launcher.');

        try {
          let login = await this.eg.login();

          if (!login)
            return reject('Cannot login on EpicGames account.');
        } catch (e) {
          console.error(e);
          reject(e.toString());
        }

        const fortnite = await this.eg.runGame(FFF, {
          build       : '++Fortnite+Release-11.40-CL-10993225',
          engineBuild : '4.24.0-10993225+++Fortnite+Release-11.40',
          netCL       : 10482997,
        });
        const stw      = await fortnite.runSubGame(ESubGame.SaveTheWorld);

        this.token = stw.fn.auth.accessToken;
        await Cache.put('fortniteToken', this.token, 60);
        resolve(stw.fn.auth.accessToken);
      });
    });
  }

  async getLatestMissions()
  {
    if (!this.token)
      throw "Token not set... please login first.";

    axios.defaults.headers.common['Authorization'] = `bearer ${this.token}`;

    try {
      let stats = await axios.get('https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/world/info');

      stats = stats.data;

      let twineId = "D9A801C5444D1C74D1B7DAB5C7C12C5B";

      let twineMissions = collect(stats.missions)
        .filter(mission => mission.theaterId === twineId)
        .toArray();

      let twineMissionAlerts = collect(stats.missionAlerts)
        .filter(mission => mission.theaterId === twineId)
        .map(theater => theater.availableMissionAlerts)
        .toArray()[0];

      let twineMissionsMapped = collect(twineMissions[0].availableMissions)
        .map(mission => {

          let mmm = Object.values(Conversions.missions);

          for (let i = 0; i < mmm.length; i++) {
            let m = mmm[i];
            if (m.maps === undefined) {
              console.log('errored part', mission, m);
            }
            if (m.maps.includes(mission.missionGenerator)) {
              mission.map = m;
              break;
            }
          }

          /* Object.values(Conversions.missions)
           .forEach(m => {
           if (m.maps === undefined) {
           console.log('errored part', mission, m);
           }
           if (m.maps.includes(mission.missionGenerator)) {
           mission.map = m;
           }
           });*/

          if (!mission.map) {
            console.log(`MAP MISSING:`, mission.missionGenerator);
          }

          let is4x      = false;
          let isSpecial = false;

          let missionRewards = collect(mission.missionRewards.items)
            .map(item => {

              Object.keys(Conversions.rewards)
                .forEach(conver => {
                  if (item.itemType.includes(conver)) {
                    item.type        = conver;
                    item.title       = Conversions.rewards[conver].title;
                    item.slug        = Conversions.rewards[conver].type;
                    item.interesting = Conversions.rewards[conver].interesting;
                    item.amountType  = item.itemType.replace('CardPack:', '').replace(conver, '').replace('_', '');
                  }
                });

              if (!item.slug) {
                console.log(`MISSION REWARD ITEM MISSING:`, item);
              }

              switch (item.slug) {
                case "epu":
                case "lpu":
                case "rpu":
                  isSpecial = true;
              }

              if (item.quantity === 4 && item.interesting) {
                is4x = true;
              }

              return item;
            })
            .filter(item => {
              return (item.type !== 'zcp_eventscaling' && item.type !== 'campaign_event_currency');
            })
            .toArray();

          //Fix up items to be one quantity when there is multiple, ie, perkup schematic xp etc

          let rewardsToTake = collect(missionRewards)
            .whereIn('slug', ['lpu', 'epu', 'rpu', 'schemxp', 'heroxp', 'surv-xp'])
            .groupBy('slug')
            .map((items, slug) => {
              let item  = items.first();
              let count = collect(items).count();

              item.quantity = count;
              return item;
            })
            .toArray();

          missionRewards = collect(missionRewards)
            .whereNotIn('slug', ['lpu', 'epu', 'rpu', 'schemxp', 'heroxp', 'surv-xp'])
            .toArray();

          missionRewards = [...missionRewards, ...rewardsToTake];

          let missionAlerts = collect(twineMissionAlerts)
            .where('tileIndex', mission.tileIndex)
            .first();

          if (missionAlerts) {
            if (missionAlerts.missionAlertRewards && missionAlerts.missionAlertRewards.items) {
              missionAlerts = collect(missionAlerts.missionAlertRewards.items)
                .filter(item => {
                  return !item.itemType.includes('Schematic');
                })
                .map(item => {
                  Object.keys(Conversions.rewards)
                    .forEach(conver => {
                      item.originalItemType = item.itemType;

                      if (item.itemType.includes('AccountResource:'))
                        item.itemType = item.itemType.replace('AccountResource:', '');
                      if (item.itemType.includes('Worker:'))
                        item.itemType = item.itemType.replace('Worker:', '').split('_')[0];
                      if (item.itemType.includes('Defender:'))
                        item.itemType = item.itemType.replace('Defender:', '').split('_')[0];

                      if (conver.includes(item.itemType)) {
                        item.type        = conver;
                        item.title       = Conversions.rewards[conver].title;
                        item.slug        = Conversions.rewards[conver].type;
                        item.interesting = Conversions.rewards[conver].interesting;
                        item.amountType  = item.itemType.replace('CardPack:', '').replace(conver, '').replace('_', '');
                      }
                    })
                  ;

                  if (!item.slug) {
                    console.log('MISSION ALERT ITEM NOT HANDLED', item);
                  }

                  switch (item.slug) {
                    case "epu":
                    case "lpu":
                    case "rpu":
                      isSpecial = true;
                  }

                  return item;
                })
                .filter(item => {
                  return (item.type !== 'zcp_eventscaling' && item.type !== 'campaign_event_currency');
                })
                .toArray();
            }
          }

          return {
            tileIndex : mission.tileIndex,
            generator : mission.missionGenerator,
            is4x      : is4x,
            isSpecial : isSpecial,
            map       : mission.map ? mission.map : null,
            rewards   : missionRewards,
            alerts    : missionAlerts ? missionAlerts : [],
          };
        })
        .filter(m => m.map.type !== 'skipped')
        .toArray();

      return twineMissionsMapped;
    } catch (e) {
      throw e;
    }
  }

  async updateSavedMissions()
  {
    try {
      await MissionReward.query().where('id', '>', 0).delete();
      await Mission.query().where('id', '>', 0).delete();

      const fortniteToken = await Cache.get('fortniteToken');
      if (fortniteToken) {
        this.setToken(fortniteToken);
        await this.fixToken();
      } else {
        await this.login();
      }

      let missions = await this.getLatestMissions();

      for (let i = 0; i < missions.length; i++) {

        let mission = missions[i];

        if (!mission.map) {
          console.log('Skipping mission, doesnt have map added: ', mission.generator);
          continue;
        }

        let missionModel = await Mission.create({
          title      : mission.map.title,
          tile_index : mission.tileIndex,
          type       : mission.map.type,
          is_special : mission.isSpecial,
        });

        for (let r = 0; r < mission.rewards.length; r++) {
          let reward = mission.rewards[r];

          if (!reward.title) {
            //console.log('Reward not added to conversions, skipping: ', mission.generator, reward);
            continue;
          }

          await MissionReward.create({
            mission_id   : missionModel.id,
            title        : reward.title,
            type         : reward.type,
            slug         : reward.slug,
            interesting  : reward.interesting,
            alert_reward : 0,
            quantity     : reward.quantity,
            amount_type  : reward.amountType,
          });

        }

        for (let r = 0; r < mission.alerts.length; r++) {
          let reward = mission.alerts[r];

          if (!reward.title) {
            //console.log('Reward not added to conversions, skipping: ', mission.generator, reward);
            continue;
          }

          await MissionReward.create({
            mission_id   : missionModel.id,
            title        : reward.title,
            type         : reward.type,
            slug         : reward.slug,
            interesting  : reward.interesting,
            alert_reward : true,
            quantity     : reward.quantity,
            amount_type  : reward.amountType,
          });

        }

      }
    } catch (e) {
      throw e;
    }
  }

}

module.exports = FortniteManager;
