const Discord = require('discord.js');
const Env     = use('Env');

class DiscordBot {
	constructor()
	{
		//this.env    = Env;
		this._client  = new Discord.Client();
		this._running = false;
	}

	runServer()
	{
		this._client.on('ready', async () => {
			this._running = true;
			console.log(`Logged in as ${this._client.user.tag}!`);
		});

		this._client.login(Env.get('DISCORD_TOKEN'));
	}

	sleep(ms)
	{
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	async awaitReadyState()
	{
		while (!this._running) {
			await this.sleep(500);
			console.log('bot still waiting to run.');
		}
		console.log('bot is up');
	}

	/**
	 * Returns a discord client instance
	 *
	 * @returns {module:"discord.js".Client}
	 */
	get client()
	{
		return this._client;
	}

	/**
	 * Returns the main guild the bot is running in
	 *
	 * @returns {Guild}
	 */
	get guild()
	{
		return this._client.guilds.find(g => g.id === '668098826866917397');
	}

}

module.exports = DiscordBot;