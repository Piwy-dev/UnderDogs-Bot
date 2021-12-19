const {Collection} = require('discord.js')
const voiceCollection = new Collection();

module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        const user = await client.users.fetch(newState.id)
        const member = newState.guild.members.cache.get(user.id)

        if(!oldState.channel && newState.channel.id === '921862098655531058') // Quand on vas dans le vocal de création du vocaux
        {
            const channel = await newState.guild.channels.create(user.tag, {
                type: 'GUILD_VOICE',
                parent: newState.channel.parent
            })
            member.voice.setChannel(channel.id)
            voiceCollection.set(user.id, channel.id)
        }
        else if(oldState.channel && oldState.channel.id === voiceCollection.get(oldState.id)){ // Si on change de salon vocal
            oldState.channel.delete()
        }
        else if(!newState.channel) { // Quand on se déconnecte de tout les vocaux
            if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
        }
    })
}