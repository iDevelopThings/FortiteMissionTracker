const Env     = use('Env');
const Discord = require('discord.js');
const client  = new Discord.Client();

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message', async (message) => {


});

client.login(Env.get('DISCORD_TOKEN'));