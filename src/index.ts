

import { ChannelType, Client, Collection, Events, GatewayIntentBits, Guild, GuildMember, PermissionsBitField, Role, TextChannel } from "discord.js";
import { CONFIG } from "./config";
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] })

client.once(Events.ClientReady, async () => {
  console.log(`BOT STARTED`);

  const server = client.guilds.cache.first();
  const fetchMembers = await server?.members.fetch()
  const members = fetchMembers?.filter(member => !member.user.bot)
  const textChannels = server?.channels.cache.filter(channel => channel.type == ChannelType.GuildText)
  const activeTextChannel: TextChannel = textChannels?.first() as TextChannel;

  if (members && server) {
    const role = await findOrCreateSleepRole(server)
    setIntervalAndExecute(() => start(members, role, activeTextChannel), 10 * 60 * 1000)
  }

})

const start = async (members: Collection<string, GuildMember>, role: Role, channel: TextChannel) => {
  const currentDate = new Date()
  const hour = currentDate.getHours()


  if (hour == CONFIG.START_HOUR) {
    members.forEach(member => {
      member.roles.remove(role)
    })

    return sendMessage('Всем доброго утра', channel)
  }

  if (hour == CONFIG.END_HOUR) {
    members.forEach(member => {
      if (member.voice.channel && member.bannable) {
        member.roles.add(role)
        member.voice.setChannel(null)
      } else {
        member.roles.add(role)
      }
    })
    return sendMessage('Всем спокойной ночи', channel)
  }
}

const findOrCreateSleepRole = async (guild: Guild) => {
  const role = guild.roles.cache.find(role => role.name == 'Sleep')
  if (role) {
    return role
  }
  return await guild.roles.create({
    name: 'Sleep',
    color: '#ff0000',
    permissions: [PermissionsBitField.Flags.ViewChannel]
  })
}

const sendMessage = (msg: string, channel: TextChannel) => {
  channel.send(msg)
}

const setIntervalAndExecute = (fn: () => void, t: number) => {
  fn()
  return setInterval(fn, t)
}

client.login(CONFIG.BOT_TOKEN)
