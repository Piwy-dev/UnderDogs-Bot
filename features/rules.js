module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId !== "rules") return;

        const { member, guild } = interaction

        // Trouve le bon role en fonction du serveur
        let findRole;
        if (guild.id === '921685478888058920') findRole = '921718701282181180'; // Serveur de test
        else if (guild.id === '878776486306381825') findRole = '879129895630962718'; // Serveur e-sports
        else return;

        // Ajoute le role au membre
        const memberRole = guild.roles.cache.find(r => r.id === findRole);
        if (!memberRole) return console.log("Le rôle membre n'existe pas !")

        member.roles.add(memberRole)

        await interaction.reply({
            content: "Merci d'avoir accepté le règlement !",
            ephemeral: true
        });
    });
}