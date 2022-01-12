const Discord = require("discord.js");
const db  = require('quick.db')
module.exports = {
	name: 'prefix',
	description: 'Changes bot prefix in guild.',
	aliases: [],
	usage: '',
    cooldown: 5,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */
async execute(message, args, client) {
	const permhata = new Discord.MessageEmbed()
	.setTitle("❌ Insufficient Perms!")
	.setDescription("You must have \`ADMINISTRATOR\` Authorization to use this command.")
	if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))return message.reply({content: "<@"+message.author.id+">",embeds: [permhata]})
		let prefix = db.fetch(`guildData_${message.guild.id}.prefix`)
        if(!args[0]){
			const hataembed = new Discord.MessageEmbed()
			hataembed.setTitle("❌ Wrong Use!")
			hataembed.setDescription("You must specify an arguments.")
			hataembed.addField("Example",`${prefix}prefix <new-prefix>`)
			return message.reply({content: "<@"+message.author.id+">",embeds: [hataembed]})
		}
		if(args[0]===prefix){
			const hataembed = new Discord.MessageEmbed()
			hataembed.setTitle("❌ Wrong Use!")
			hataembed.setDescription("The new prefix cannot be the same as the previous one.")
			hataembed.addField("Example",`${prefix}prefix <new-prefix>`)
			return message.reply({content: "<@"+message.author.id+">",embeds: [hataembed]})
		}
		if(args[0].length>5){
			const hataembed = new Discord.MessageEmbed()
			hataembed.setTitle("❌ Wrong Use!")
			hataembed.setDescription("The new prefix character length cannot exceed 5.")
			hataembed.addField("Example",`${prefix}prefix <new-prefix>`)
			return message.reply({content: "<@"+message.author.id+">",embeds: [hataembed]})
		}
		const embed = new Discord.MessageEmbed()
		embed.setTitle("✅ Successfully")
		embed.setDescription("New prefix successfully changed.")
		embed.addField(`New Prefix`,`${args[0]}`)
		embed.addField(`Old Prefix`,`${prefix}`)
		db.set(`guildData_${message.guild.id}`,{prefix: `${args[0]}`})
		return message.reply({content: "<@"+message.author.id+">",embeds: [embed]})
	},
};