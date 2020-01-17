<template>
  <div class="h-full flex justify-center">
    <div class="container">
      <div class="flex h-full">

        <div class="w-1/4 p-4">

          <div class="bg-gray-800 rounded shadow w-full">

            <div class="p-4 bg-gray-700">
              <h4 class="font-bold">Filter Missions</h4>
            </div>

            <div class="p-4 rounded bg-gray-800">

              <label class="block text-gray-500 font-bold flex items-center mb-4">
                <input class="mr-2 leading-tight" type="checkbox" v-model="filters.doubleMissionRewards">
                <span class="text-sm" v-tooltip="'Show missions containing double rewards, 4x pure drop, 3x legendary perkup etc'">
                  Double rewards
                </span>
              </label>
              <label class="block text-gray-500 font-bold flex items-center mb-4">
                <input class="mr-2 leading-tight" type="checkbox" v-model="filters.specialRewards">
                <span class="text-sm" v-tooltip="'Show missions with the rewards, perkup, evo mats etc'">
                  Special rewards
                </span>
              </label>

              <div>
                <span class="text-gray-500 font-bold mb-4">Filter by rewards</span>

                <div v-if="rewards.response" class="flex items-center flex-wrap mt-4">
                  <div v-for="reward in rewards.response.rewards" :class="hasFilter(reward, 'rewards') ? '' : 'opacity-50'"
                       class="mb-3 mr-2 cursor-pointer "
                       v-tooltip="reward.title"
                       @click="hasFilter(reward, 'rewards') ? removeFilter(reward, 'rewards') : addFilter(reward, 'rewards')">
                    <img :src="`/icons/rewards/${reward.type}.png`" width="35px">
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <span class="text-gray-500 font-bold mb-4">Filter by mission</span>

                <div v-if="rewards.response" class="flex items-center flex-wrap mt-4">
                  <div v-for="reward in rewards.response.missions" :class="hasFilter(reward, 'missions') ? '' : 'opacity-50'"
                       class="mb-3 mr-2 cursor-pointer"
                       v-tooltip="reward.title"
                       @click="hasFilter(reward, 'missions') ? removeFilter(reward, 'missions') : addFilter(reward, 'missions')">
                    <img :src="`/icons/missions/${reward.type}.png`" width="28px">
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div class="w-3/4 p-4">

          <div v-if="missions" class="w-full">
            <transition-group name="fade">
              <div v-for="mission in missions" :key="mission.id" class="bg-gray-800 mb-4 p-4 shadow flex items-center">
                <div class="w-2/5 flex items-center border-r pr-4 border-gray-700">
                  <h1 class="font-bold mr-3">⚡ {{mission.level ? mission.level : '..'}}</h1>
                  <img :src="`/icons/missions/${mission.type}.png`" class="mr-4" alt="" width="28px">
                  <strong>{{mission.title}}</strong>
                </div>
                <div class="w-1/5 pl-4">
                  <strong class="text-gray-600">Rewards:</strong>
                  <div class="flex items-center">
                    <div v-for="reward in getRewardsType(mission, 'rewards')" class="flex items-center mr-2" v-tooltip="reward.title">
                      <template v-if="reward.quantity > 100">
                        {{reward.quantity | number}} <img :src="`/icons/rewards/${reward.slug}.png`" class="ml-2 mr-2" alt=""
                                                          width="28px">
                      </template>
                      <template v-else-if="reward.quantity > 1 && reward.quantity < 5">
                        {{reward.quantity}}x <img :src="`/icons/rewards/${reward.slug}.png`" class="ml-2 mr-2" alt=""
                                                  width="28px">
                      </template>
                      <template v-else><img :src="`/icons/rewards/${reward.slug}.png`" class="" alt="" width="28px"></template>

                    </div>
                  </div>
                </div>
                <div class="w-1/5 pl-4">
                  <strong class="text-gray-600">Alert Rewards:</strong>
                  <div class="flex items-center" v-if="getRewardsType(mission, 'alerts').length">
                    <div v-for="reward in getRewardsType(mission, 'alerts')" class="flex items-center mr-4" v-tooltip="reward.title">
                      {{reward.quantity | number}} <img :src="`/icons/rewards/${reward.slug}.png`" class="ml-2 mr-4" alt="" width="28px">
                    </div>
                  </div>
                  <div v-else>
                    None...
                  </div>
                </div>
                <div class="w-1/5 pl-4">
                  <div class="flex items-center flex-wrap" v-if="mission.modifiers.length">
                    <div v-for="modifier in mission.modifiers" class="flex items-center mb-1 mr-1"
                         v-tooltip="`<strong>${modifier.title}</strong> <br>${modifier.description}`">
                      <img :src="modifier.image" class="" alt="" style="height: 30px; min-width: 30px;">
                    </div>
                  </div>
                  <div v-else>
                    None...
                  </div>
                </div>
              </div>
              <div v-if="missions.length === 0" key="no-missions" class="bg-gray-800 mb-4 p-4 shadow text-center">
                <h1 class="text-2xl">There are no missions to show...</h1>
                <p class="text-gray-400">Adjust your search to fix this</p>
              </div>
            </transition-group>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name    : "Home",
    mounted()
    {
      this.getMissions();
      this.getRewards();

    },
    data()
    {
      return {
        rewards : {
          loading  : false,
          response : null,
        },

        missions : null,
        loading  : false,
        error    : null,

        filters : {
          doubleMissionRewards : false,
          specialRewards       : false,
          rewards              : [],
          missions             : [],
        },
      };
    },
    watch   : {
      'filters.doubleMissionRewards' : function () {
        this.getMissions();
      },
      'filters.specialRewards'       : function () {
        this.getMissions();
      },
      'filters.rewards'              : function () {
        this.getMissions();
      },
      'filters.missions'             : function () {
        this.getMissions();
      },
    },
    methods : {

      getMissions()
      {
        this.loading    = true;
        let queryString = `/missions`;

        let queryStringParams = [];
        if (this.filters.doubleMissionRewards) {
          queryStringParams.push(`double_rewards=true`);
        }
        if (this.filters.specialRewards) {
          queryStringParams.push(`special_rewards=true`);
        }
        if (this.filters.rewards.length) {
          let rewards = this.filters.rewards.map(r => r.type).join(',');

          queryStringParams.push(`rewards=${rewards}`);
        }
        if (this.filters.missions.length) {
          let rewards = this.filters.missions.map(r => r.type).join(',');

          queryStringParams.push(`maps=${rewards}`);
        }

        if (queryStringParams.length >= 1) {
          queryString += '?' + queryStringParams.join('&');
        }

        axios.get(queryString)
          .then(response => {
            this.missions = response.data;
          })
          .catch(error => {
            this.error = error.toString();
            console.log(error);
          })
          .finally(() => this.loading = false);
      },

      getRewardsType(mission, type = 'all')
      {
        if (!mission.rewards) console.log(mission);

        if (type === 'all') return mission.rewards;
        if (type === 'rewards') return mission.rewards.filter(reward => reward.alert_reward === 0);
        if (type === 'alerts') return mission.rewards.filter(reward => reward.alert_reward === 1);

        return mission.rewards;
      },

      getRewards()
      {
        this.rewards.loading = true;
        axios.get('/rewards')
          .then(response => {
            this.rewards.response = response.data;
          })
          .catch(error => console.error(error))
          .finally(() => {
            this.rewards.loading = false;
          });

      },

      addFilter(reward, type = 'rewards')
      {
        if (this.filters[type].find(r => r.type === reward.type)) {
          return;
        }

        this.filters[type].push(reward);
      },

      removeFilter(reward, type = 'rewards')
      {
        let index = this.filters[type].findIndex(r => r.type === reward.type);

        this.filters[type].splice(index, 1);
      },

      hasFilter(reward, type = 'rewards')
      {
        return this.filters[type].find(r => r.type === reward.type) !== undefined;
      },

    },
  };
</script>

<style scoped lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
