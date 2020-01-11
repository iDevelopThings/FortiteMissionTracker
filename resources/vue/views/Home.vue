<template>
  <div class="h-full flex justify-center">
    <div class="container">
      <div class="flex h-full">
        <div class="w-1/4 p-4">
          <div class="bg-gray-800 rounded shadow">
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
                  Special Rewards
                </span>
              </label>

              <div>
                <span class="text-gray-500 font-bold mb-4">Filter by rewards</span>

                <div v-if="rewards.loading">
                  Loading Rewards...
                </div>
                <div v-if="!rewards.loading && rewards.response" class="flex items-center flex-wrap mt-4">
                  <div v-for="reward in rewards.response.rewards" v-if="!hasFilter(reward, 'rewards')" class="mb-3 mr-2 cursor-pointer hover:opacity-50"
                       v-tooltip="reward.title"
                       @click="addFilter(reward, 'rewards')">
                    <img :src="`/icons/rewards/${reward.type}.png`" width="35px">
                  </div>
                </div>

                <span class="text-gray-500 font-bold mb-4">Current Filters:</span>
                <div v-if="filters.rewards.length" class="flex items-center flex-wrap mt-4">
                  <div v-for="reward in filters.rewards" class="mb-3 mr-2 cursor-pointer hover:opacity-50" v-tooltip="reward.title"
                       @click="removeFilter(reward, 'rewards')">
                    <img :src="`/icons/rewards/${reward.type}.png`" width="35px">
                  </div>
                </div>
                <div v-else><span class="text-sm text-gray-500  mb-4">No reward filters selected...</span></div>
              </div>

              <div class="mt-4">
                <span class="text-gray-500 font-bold mb-4">Filter by mission</span>

                <div v-if="rewards.loading">
                  Loading Rewards...
                </div>
                <div v-if="!rewards.loading && rewards.response" class="flex items-center flex-wrap mt-4">
                  <div v-for="reward in rewards.response.missions" v-if="!hasFilter(reward, 'missions')" class="mb-3 mr-2 cursor-pointer hover:opacity-50"
                       v-tooltip="reward.title"
                       @click="addFilter(reward, 'missions')">
                    <img :src="`/icons/missions/${reward.type}.png`" width="28px">
                  </div>
                </div>

                <span class="text-gray-500 font-bold mb-4">Current Filters:</span>
                <div v-if="filters.missions.length" class="flex items-center flex-wrap mt-4">
                  <div v-for="reward in filters.missions" class="mb-3 mr-2 cursor-pointer hover:opacity-50" v-tooltip="reward.title"
                       @click="removeFilter(reward, 'missions')">
                    <img :src="`/icons/missions/${reward.type}.png`" width="28px">
                  </div>
                </div>
                <div v-else><span class="text-sm text-gray-500  mb-4">No map filters selected...</span></div>
              </div>

            </div>
          </div>
        </div>
        <div class="w-3/4">

          <div v-if="loading">
            Loading Missions...
          </div>

          <div v-if="!loading && missions" class="p-4">

            <div v-for="mission in missions" class="bg-gray-800 mb-4 p-4 shadow flex items-center">
              <div class="w-1/3 flex items-center border-r pr-4 border-gray-700">
                <img :src="`/icons/missions/${mission.type}.png`" class="mr-4" alt="" width="28px">
                <strong>{{mission.title}}</strong>
              </div>
              <div class="w-1/3 pl-4">
                <strong class="text-gray-600">Rewards:</strong>
                <div class="flex items-center">
                  <div v-for="reward in getRewardsType(mission, 'rewards')" class="flex items-center mr-2" v-tooltip="reward.title">
                    <template v-if="reward.quantity > 1">{{reward.quantity}}x <img :src="`/icons/rewards/${reward.slug}.png`" class="ml-2" alt="" width="28px">
                    </template>
                    <template v-else><img :src="`/icons/rewards/${reward.slug}.png`" class="" alt="" width="28px"></template>

                  </div>
                </div>
              </div>
              <div class="w-1/3 pl-4">
                <strong class="text-gray-600">Alert Rewards:</strong>
                <div class="flex items-center" v-if="getRewardsType(mission, 'alerts').length">
                  <div v-for="reward in getRewardsType(mission, 'alerts')" class="flex items-center mr-2" v-tooltip="reward.title">
                    {{reward.quantity}}x <img :src="`/icons/rewards/${reward.slug}.png`" class="ml-2" alt="" width="28px">
                  </div>
                </div>
                <div v-else>
                  None...
                </div>
              </div>
            </div>

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

</style>
