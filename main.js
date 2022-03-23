const data = require('./api/spells');
const config = require('./config');
const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log("WITNESS ME")
})

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

  if (msg.content.startsWith("!dnd ")) {
    let foundSpell = []
    data.spellData.forEach(element => {
      if (element.name.toLowerCase() === msg.content.split("!dnd ")[1].toLowerCase()) {
        foundSpell = element
      }
    })
    let showEntries = `${foundSpell.entries.reduce((accum, curVal) => {
      if (curVal.items) {
        return accum += `\n \n-${curVal.items.join("\n \n-")}\n`
      } else if (curVal.entries) {
        return accum += `\n \n-${curVal.entries.join("\n \n-")}\n`
      } else if (curVal.type === 'table') {
        return accum += `\n \n a goddamn table you roll on? you fuckin kiddin me im not coding that shit for free \n`
      } else {
        return accum += `\n\n${curVal}`
      }
    })}`

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
      .setDescription(showEntries)
    msg.reply(({ embeds: [exampleEmbed] }))
  }
})

client.login(config.token)
