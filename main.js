const config = require('./config.json');
const discord = require('discord.js');
const axios = require('axios')
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const getSpell = () => {
  return axios.get(`http://localhost:8088/spell`)
}

// https://www.dnd5eapi.co/api/spells/${spellName}

client.on("ready", () => {
  console.log("WITNESS ME")
})

// getSpell(`${msg.content.toLowerCase().split("!")[1]}`)

client.on("messageCreate", msg => {

  const checkForM = (spell) => {
    if (spell.components.m != undefined) {
      if (spell.components.m.text != undefined) {
        return spell.components.m.text
      } else {
        return spell.components.m
      }
    } else {
      return ''
    }
  }
  if (msg.content.startsWith("!")) {

    let foundSpell = []
    getSpell().then(res => {
      res.data.forEach(element => {
        if (element.name.toLowerCase() === msg.content.split("!")[1].toLowerCase()) {
          foundSpell = element
        }
      })

      console.log(foundSpell);

    }).then(() => {
      const { components: { m = 'defaultValue' } } = foundSpell
      const exampleEmbed = new MessageEmbed()
        .setColor('#A7171A')
        .setTitle(`${foundSpell.name}\n*${foundSpell.school} ${foundSpell.level}* ${foundSpell.meta ? "(ritual)" : ''}
      `)
        .setThumbnail('https://thumbs.gfycat.com/EnlightenedTalkativeCapybara-max-1mb.gif')
        .addFields(
          { name: 'Casting Time', value: `${foundSpell.time[0].number} ${foundSpell.time[0].unit}`, inline: true },
          { name: 'Range', value: `${foundSpell.range.distance.amount ? foundSpell.range.distance.amount : ''} ${foundSpell.range.distance.type}`, inline: true },
          { name: 'Duration', value: `${foundSpell.duration[0].type === "instant" ? foundSpell.duration[0].type : foundSpell.duration[0].duration.amount + " " + foundSpell.duration[0].duration.type} ${foundSpell.duration[0].concentration ? "(concentration)" : ""}`, inline: true },
          { name: 'Components', value: `${foundSpell.components.v ? "V" : ""} ${foundSpell.components.s ? "S" : ""} ${checkForM(foundSpell)}`, inline: true },
        )
        .setFooter(`${foundSpell.entries.join("\n\n")}`)
      msg.reply(({ embeds: [exampleEmbed] }))
    }).catch(error => {
      msg.reply("Invalid spell name.")
    })
  }
})

client.login(config.token)




