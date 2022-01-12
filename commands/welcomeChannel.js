const Canvas = require("discord-canvas")
const Discord = require("discord.js");
const db = require('quick.db')
module.exports = {
	name: 'welcomechannel',
	description: 'Welcomes users joining your server.',
	aliases: [],
	usage: 'welcomechannel <#channel>',
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

    if(db.fetch(`guildData_${message.guild.id}.welcomechannel`)&& args[0] !== 'close'){
        const hataembed = new Discord.MessageEmbed()
        hataembed.setTitle("❌ Wrong Use!")
        hataembed.setDescription("If you want close")
        hataembed.addField("Example",`${prefix}welcomesystem close`)
        return message.reply({content: "<@"+message.author.id+">",embeds: [hataembed]})
    }else{
    if(args[0] === 'close'){
        const hataembed = new Discord.MessageEmbed()
        hataembed.setTitle("✅ Successfully")
        hataembed.setDescription("Welcome Channel System successfully closed.")
        db.delete(`guildData_${message.guild.id}.welcomechannel`)
        return message.reply({content: "<@"+message.author.id+">",embeds: [hataembed]})
    }
        let kanal = message.mentions.channels.first()||message.guild.channels.cache.get(args[0])
        if(!kanal){
            const hataembed = new Discord.MessageEmbed()
			hataembed.setTitle("❌ Wrong Use!")
			hataembed.setDescription("You must specify an arguments.")
			hataembed.addField("Example",`${prefix}.welcomechannel <#channel>`)
			return message.reply({content: "<@"+message.author.id+">",embeds: [hataembed]})
        }
        const image = await new Canvas.Welcome()
        .setUsername(`${message.author.username}`)
        .setDiscriminator(`${message.author.discriminator}`)
        .setMemberCount(`${message.guild.members.cache.size}`)
        .setGuildName(`${message.guild.name}`)
        .setAvatar(`${message.author.displayAvatarURL({ format: "jpg" })}`)
        .setColor("border", "#8015EA")
        .setColor("username-box", "#8015EA")
        .setColor("discriminator-box", "#8015EA")
        .setColor("message-box", "#8015EA")
        .setColor("title", "#8015EA")
        .setColor("avatar", "#8015EA")
        .setBackground("https://media.istockphoto.com/photos/low-poly-black-background-picture-id595734386?k=20&m=595734386&s=170667a&w=0&h=0vEw9VjFtsfh5LGQm8Jdofg5CYmd7jpPhmJmnis-2qM=")
        .toAttachment();
        const embed = new Discord.MessageEmbed()
		embed.setTitle("✅ Successfully")
		embed.setDescription("Welcome Channel successfully set.")
        embed.setAuthor(`If a member joins the server, the welcome system will work as in the picture.`)
		db.set(`guildData_${message.guild.id}.welcomechannel`,`${kanal.id}`)
        const attament = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");
		return message.channel.send({content: "<@"+message.author.id+">",embeds: [embed],files: [attament]})
    }
	},
};