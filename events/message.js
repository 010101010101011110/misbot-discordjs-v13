const Discord = require('discord.js');
const config = require('../config.js');
const db = require('quick.db')


/**@param {Discord.Client} client
 * @param {Discord.messageCreate} messageCreate
 */

module.exports = async (message,client) => {
    if (message.channel.type !== 'GUILD_TEXT') return;

    if(!message.guild.members.cache.get(client.user.id).permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))return;
    let dataprefix = db.fetch(`guildData_${message.guild.id}.prefix`)
    
    if(!dataprefix){
        db.set(`guildData_${message.guild.id}`,{prefix: `${config.prefix}`})
    }
let prefix = db.fetch(`guildData_${message.guild.id}.prefix`);

if (!message.content.startsWith(prefix) || message.author.bot) return;
const cooldowns = client.cooldowns
const args = message.content.slice(prefix.length).split(/ +/);
const commandName = args.shift().toLowerCase();

const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

if (!command) return;


if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply({ content: `Please wait ${timeLeft.toFixed(1)} seconds for \`${command.name}\` command.`, allowedMentions: { repliedUser: false }});
    }
}

timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
try {
    command.execute(message, args, client);
} catch (error) {
    console.error(error);
    message.reply('An error occurred while trying to execute this command!');
}
return;
}