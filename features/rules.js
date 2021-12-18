module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId !== "rules") return;

        const { member, guild } = interaction

        const memberRole = guild.roles.cache.find(r => r.id === "921718701282181180");
        if (!memberRole) return console.log("Le rôle membre n'existe pas !")

        member.roles.add(memberRole)

        await interaction.reply({
            content: "Merci d'avoir accepté le règlement !", 
            ephemeral: true
        });
    });
}