'use strict';

const {ServiceProvider} = require('@adonisjs/fold');

class DiscordBotProvider extends ServiceProvider {
	/**
	 * Register namespaces to the IoC container
	 *
	 * @method register
	 *
	 * @return {void}
	 */
	register()
	{
		this.app.singleton('Discord', function (app) {
			//const Env = app.use('Env');
			return new (require('./../app/Services/DiscordBot/DiscordBot'))();
		});
	}

	/**
	 * Attach context getter when all providers have
	 * been registered
	 *
	 * @method boot
	 *
	 * @return {void}
	 */
	boot()
	{
		//
	}
}

module.exports = DiscordBotProvider;
