const discord = require('discord.js');
const axios = require('axios')
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});

const getSpell = (spellName) => {
  return axios.get(`https://www.dnd5eapi.co/api/spells/${spellName}`)
  // .catch(err => console.log('ERR', err ))
}

client.on("ready", () => {
  console.log("WITNESS ME")
})

client.on("messageCreate", msg => {
  if (msg.content.startsWith("!")){
    getSpell(`${msg.content.split("!")[1]}`).then(res => {
      msg.reply(
`**${res.data.name}**
*${res.data.school.name} ${res.data.level}*
**Casting Time:** ${res.data.casting_time}
**Range:** ${res.data.range}
**Components:** ${res.data.components.join(", ")}
**Duration:** ${res.data.duration}
${res.data.desc.join("")}
        `
      )
    })
  }
})

client.on('messageCreate', function(msg){
  if(msg.content === 'ping'){
      msg.reply("pong");
  }
});

client.login("OTU0NTEyNTU0NzI4Nzc5ODE2.YjUNFw._RzqabbmfwWBuDQpKuurgeeijj0")



