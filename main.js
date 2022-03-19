const config = require('./config.json');
const discord = require('discord.js');
const axios = require('axios')
const { MessageEmbed } = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});

const getSpell = (spellName) => {
  return axios.get(`https://www.dnd5eapi.co/api/spells/${spellName}`)
}

client.on("ready", () => {
  console.log("WITNESS ME")
})

client.on("messageCreate", msg => {
  if (msg.content.startsWith("!")){
    getSpell(`${msg.content.toLowerCase().split("!")[1]}`).then(res => {
  
    const exampleEmbed = new MessageEmbed()
	.setColor('#A7171A')
	.setTitle(`${res.data.name}`)
	.setDescription(`*${res.data.school.name} ${res.data.level}*`)
	.setThumbnail('https://www.enworld.org/attachments/ampersand-on-black-png.112187/')
	.addFields(
		{ name: 'Casting Time', value: `${res.data.casting_time}`, inline: true },
		{ name: 'Range', value: `${res.data.range}`, inline: true },
    { name: 'Duration', value: `${res.data.duration}`, inline: true },
    { name: 'Components', value: `${res.data.components.join(", ")}`, inline: true },
    { name: '\u200B', value: '\u200B' },
	)
	.setDescription(`${res.data.desc.join("\n\n")}`)
  msg.reply(({ embeds: [exampleEmbed] }))
    }).catch(error => {
      msg.reply("Invalid spell name.")
    })
  }
})

client.login(config.token)
