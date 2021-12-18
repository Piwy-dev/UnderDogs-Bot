const prefix = "!"

module.exports = (client, commandOptions) => {
  let {
    commands,
    expectedArgs = '',
    minArgs = 0,
    maxArgs = null,
    requiredRoles = [],
    callback,
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof commands === 'string') {
    commands = [commands]
  }

  // Listen for messages
  client.on('messageCreate', (message) => {
    const { member, content, guild } = message

    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`

      if (
        content.toLowerCase().startsWith(`${command} `) ||
        content.toLowerCase() === command
      ) {
        // A command has been ran

        // Ensure the user has the required roles
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          )

          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `You must have the "${requiredRole}" role to use this command.`
            )
            return
          }
        }

        // Split on any number of spaces
        const args = content.split(/[ ]+/)

        // Remove the command which is the first index
        args.shift()

        // Ensure we have the correct number of arguments
        if (
          args.length < minArgs ||
          (maxArgs !== null && args.length > maxArgs)
        ) {
          message.reply(`Mauvaise syntaxe, utilises: ${prefix}${alias} ${expectedArgs}`)
          return
        }

        // Handle the custom command code
        callback(message, args, args.join(' '), client)

        return
      }
    }
  })
}