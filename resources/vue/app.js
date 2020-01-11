const VueRouter = require('vue-router').default;
window.Vue      = require('vue');
require('vue-stash');
import VTooltip from 'v-tooltip';

Vue.use(VTooltip);
Vue.use(VueRouter);
//import store from './stores/Store';

window.axios                                             = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const router = new VueRouter({
  //mode   : 'history',
  routes : [
    {
      path      : '/',
      component : require('./views/Home.vue'),
    },
    {path : '*', redirect : '/'},
  ],
});

const app = new Vue({
  router,
  el      : '#app',
  //data    : {store},
  async mounted()
  {
  },
  methods : {},
});

window.app = app;
