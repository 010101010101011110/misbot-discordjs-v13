const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MEMBERS,Discord.Intents.FLAGS.GUILD_BANS,Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Discord.Intents.FLAGS.GUILD_INTEGRATIONS,Discord.Intents.FLAGS.GUILD_WEBHOOKS,Discord.Intents.FLAGS.GUILD_INVITES,Discord.Intents.FLAGS.GUILD_VOICE_STATES,Discord.Intents.FLAGS.GUILD_PRESENCES,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,Discord.Intents.FLAGS.DIRECT_MESSAGES,Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const fs = require("fs");
const db = require('quick.db')
const moment = require("moment");
const config = require("./config.js");

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
/*              COMMAND FILES              */

const commander = fs.readdirSync('./commands').filter(files => files.endsWith('.js'));
for (const files of commander) {
	const command = require(`./commands/${files}`);
    client.commands.set(command.name, command);
    const date = new Date()
    console.log("["+ moment(date).format("DD/MM/YYYY HH:mm") + "]: Command named " + command.name + " is loaded")
}

/*              COMMAND FILES              */

/*               EVENT FILES               */

const requestEvent = (event) => require(`./events/${event}`)
client.on('messageCreate', (messageCreate) => requestEvent('message')(messageCreate,client));

/*               EVENT FILES               */

client.on("ready", async () => {

    client.user.setPresence({ activities: [{ name: config.activities }] });
    console.log('Im Ready.')
    const Timer = require('setinterval');
    const t = new Timer(async () => {
      const server = "930118630052610109"//voice channel
      const users = "930118671483944960"//voice channel
      client.channels.cache.get(server).setName(`${client.guilds.cache.size} Servers`)
      client.channels.cache.get(users).setName(`${client.users.cache.size} Users`)
    }, 100000);
    t.setInterval();
      

})


client.on("messageCreate", async message =>{
  if (message.mentions.has(client.user.id)) {
    if (message.author.bot) return false;
if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;

    message.reply({content:"Hello there, my prefix is `"+config.prefix+"` in this guild."});
}
})
client.login(config.token)

client.on("guildDelete",async guild =>{
db.delete(`${guild.id}`)
})

const Canvas = require("discord-canvas")
client.on("guildMemberRemove",async member =>{
  if(!client.guilds.cache.get(member.guild).members.cache.get(client.user.id).permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))return;
  if(db.fetch(`guildData_${member.guild.id}.goodbyechannel`)){
    const image = await new Canvas.Goodbye()
    .setUsername(`${member.user.username}`)
    .setDiscriminator(`${member.user.discriminator}`)
    .setMemberCount(`${member.guild.members.cache.size}`)
    .setGuildName(`${member.guild.name}`)
    .setAvatar(`${member.user.displayAvatarURL({ format: "jpg" })}`)
    .setColor("border", "#ff0000")
    .setColor("username-box", "#ff0000")
    .setColor("discriminator-box", "#ff0000")
    .setColor("message-box", "#ff0000")
    .setColor("title", "#ff0000")
    .setColor("avatar", "#ff0000")
    .setBackground("https://media.istockphoto.com/photos/low-poly-black-background-picture-id595734386?k=20&m=595734386&s=170667a&w=0&h=0vEw9VjFtsfh5LGQm8Jdofg5CYmd7jpPhmJmnis-2qM=")
    .toAttachment();
    const attament = new Discord.MessageAttachment(image.toBuffer(), "goodbye-image.png");
    if(client.channels.cache.get(db.fetch(`guildData_${member.guild.id}.goodbyechannel`)) === undefined){
      return db.delete(`guildData_${member.guild.id}.goodbyechannel`)
     }
    client.channels.cache.get(db.fetch(`guildData_${member.guild.id}.goodbyechannel`)).send({files: [attament]})
  }
})

client.on("guildMemberAdd",async member =>{
  if(!client.guilds.cache.get(member.guild).members.cache.get(client.user.id).permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))return;
  if(db.fetch(`guildData_${member.guild.id}.welcomechannel`)){
    const image = await new Canvas.Welcome()
    .setUsername(`${member.user.username}`)
    .setDiscriminator(`${member.user.discriminator}`)
    .setMemberCount(`${member.guild.members.cache.size}`)
    .setGuildName(`${member.guild.name}`)
    .setAvatar(`${member.user.displayAvatarURL({ format: "jpg" })}`)
    .setColor("border", "#8015EA")
    .setColor("username-box", "#8015EA")
    .setColor("discriminator-box", "#8015EA")
    .setColor("message-box", "#8015EA")
    .setColor("title", "#8015EA")
    .setColor("avatar", "#8015EA")
    .setBackground("https://media.istockphoto.com/photos/low-poly-black-background-picture-id595734386?k=20&m=595734386&s=170667a&w=0&h=0vEw9VjFtsfh5LGQm8Jdofg5CYmd7jpPhmJmnis-2qM=")
    .toAttachment();
    const attament = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");
    if(client.channels.cache.get(db.fetch(`guildData_${member.guild.id}.welcomechannel`)) === undefined){
     return db.delete(`guildData_${member.guild.id}.welcomechannel`)
    }
    client.channels.cache.get(db.fetch(`guildData_${member.guild.id}.welcomechannel`)).send({files: [attament]})
  }
})