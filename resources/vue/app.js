const VueRouter = require('vue-router').default;
window.Vue      = require('vue');
require('vue-stash');
import VTooltip from 'v-tooltip';

Vue.use(VTooltip);
Vue.use(VueRouter);
import store    from './Store';

window.axios                                             = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Vue.filter('number', function (num) {
	num    = parseInt(num);
	var si = [
		{value : 1, symbol : ""},
		{value : 1E3, symbol : "k"},
		{value : 1E6, symbol : "M"},
		{value : 1E9, symbol : "G"},
		{value : 1E12, symbol : "T"},
		{value : 1E15, symbol : "P"},
		{value : 1E18, symbol : "E"},
	];
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(2).replace(rx, "$1") + si[i].symbol;
});

let isAuthed = () => window.localStorage.getItem('token') !== null;

const router = new VueRouter({
	//mode   : 'history',
	routes : [
		{
			path      : '/',
			component : require('./views/Layouts/Layout.vue'),
			children  : [
				{
					path      : '/',
					component : require('./views/Home.vue'),
				},
				{
					path      : '/login',
					component : require('./views/Auth/Login.vue'),
				},
				{
					path      : '/register',
					component : require('./views/Auth/Register.vue'),
				},
				{
					path        : '/account',
					component   : require('./views/Account/AccountLayout.vue'),
					beforeEnter : (to, from, next) => {
						if (!isAuthed())
							next('/login');
						else
							next();

					},
					children    : [
						{
							path      : '/account/overview',
							component : require('./views/Account/Overview.vue'),
						},
						{
							path      : '/account/api',
							component : require('./views/Account/Api.vue'),
						},

						{path : '/', redirect : '/account/overview'},
					],
				},
			],
		},

		{path : '*', redirect : '/'},
	],
});

const app = new Vue({
	router,
	el      : '#app',
	data    : {store},
	async mounted()
	{

		await this.$store.checkAndHandleAuth();

	},
	methods : {},
});

window.app = app;
