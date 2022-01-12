const Discord = require("discord.js");

module.exports = {
	name: 'invite',
	description: 'Sends invite link of bot.',
	aliases: [],
	usage: '',
    cooldown: 5,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */
async execute(message, args, client) {
		const row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
			.setStyle('LINK')
			.setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)
			.setLabel("Invite your server")
		)
		message.reply({content: "<@"+message.author.id+"> This is my invite link!",components: [row]})
	},
};