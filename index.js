var EventEmitter = require('events')
const { DB } = require("quickmongo");
const mdb = new DB(process.env.INVITES);
async function aJson(input,value,database,type){
	if(type){
let a = await mdb.get(database)
let text = JSON.stringify(a)
let text2 = text.replace('}',"")
if(text2 === "{"){
let texta = `{"${input}":${value}}`
mdb.set(database,JSON.parse(texta))
return true
}else{
let texta = `${text2},"${input}":${value}}`
mdb.set(database,JSON.parse(texta))
return true
}
	}else{
let a = await mdb.get(database)
let text = JSON.stringify(a)
let text2 = text.replace('}',"")
if(text2 === "{"){
let texta = `{"${input}":"${value}"}`
mdb.set(database,JSON.parse(texta))
return true
}else{
let texta = `${text2},"${input}":"${value}"}`
mdb.set(database,JSON.parse(texta))
return true
}
}
}
module.exports = class Invite extends EventEmitter{
	constructor(client){
		super();
		let event = new EventEmitter
		client.on('ready', async () => {
		if(!(await(mdb.has(`invites`)))){
				mdb.set('invites',{})
		}	
		if(!(await(mdb.has(`invited`)))){
				mdb.set('invited',{})
		}
		let invites = await mdb.get(`invites`)
		let invited = await mdb.get(`invited`) 
        while (s4d.client && s4d.client.token) {
            await delay(50)
            let data = await mdb.all()
            await console.log('[Invite Tracker]: data Updated!')
			await delay(150)
        }
    client.guilds.cache.forEach(async guild => { 
        guild.invites.fetch().then(async guildInvites => {
          guildInvites.forEach(async guildInvite => {
						if((await(mdb.get(`invites.${guildInvite.inviter.id}`))) !== undefined){
							mdb.set(`invites.${guildInvite.inviter.id}`,0)
							invites = await mdb.get(`invites`)
							let b = (await (mdb.get(`invites.${guildInvite.inviter.id}`))) === null ? 0 : (await(mdb.get(`invites.${guildInvite.inviter.id}`)))
							let c = b === undefined ? 0 : b
							let d = Number(c)
							let a = d + guildInvite.uses
							console.log(a)
							mdb.set(`invites.${guildInvite.inviter.id}`,a)
							invites = await mdb.get(`invites`)
						}else{
						aJson(guildInvite.inviter.id,Number(guildInvite.uses),"invites","number")
						invites = await mdb.get(`invites`)
						
						}
						aJson(`id${guildInvite.code}`,guildInvite.inviter.id,"invites")
						aJson(guildInvite.code,guildInvite.uses,"invites")
						invites = await mdb.get(`invites`)
          })
        })
    })
}) 
client.on('inviteCreate', async (guildInvite) => { 
						if((await(mdb.get(`${guildInvite.inviter.id}`))) !== undefined){
							let a = Number((await(mdb.get(`${guildInvite.inviter.id}`)))) + Number(guildInvite.uses)
							mdb.set(`invites.${guildInvite.inviter.id}`,a)
							invites = await mdb.get(`invites`)
						}else{
						aJson(guildInvite.inviter.id,Number(guildInvite.uses),"invites","number")
						invites = await mdb.get(`invites`)
						}
						aJson(`id${guildInvite.code}`,guildInvite.inviter.id,"invites")
						aJson(guildInvite.code,guildInvite.uses,"invites")
						invites = await mdb.get(`invites`)
})

client.on('guildMemberAdd', async (member) => {
    member.guild.invites.fetch().then(async guildInvites => { 
        guildInvites.forEach(async invite => { 
            if(invite.uses != (await(mdb.get(`invites.${invite.code}`)))) { 
								    client.guilds.cache.forEach(async guild => { 
										guild.invites.fetch().then(async guildInvites2 => {
											guildInvites2.forEach(async guildInvite3 => {
																		if(await mdb.get(`${guildInvite3.inviter.id}`) !== undefined){
							let a = Number(await mdb.get(`${guildInvite3.inviter.id}`)) + Number(guildInvite3.use)
							mdb.set(`invites.${guildInvite3.inviter.id}`,a)
							invites = await mdb.get(`invites`)
						}else{
						aJson(guildInvite3.inviter.id,Number(guildInvite3.uses),"invites","number")
						invites = await mdb.get(`invites`)
						}
						aJson(`id${guildInvite3.code}`,guildInvite3.inviter.id,"invites")
						aJson(guildInvite3.code,guildInvite3.uses,"invites")
						invites = await mdb.get(`invites`)
						tminvited = await mdb.get('invited')
											})
										})
								})
								if(invites === "{}"){
									invited = tminvited;
									aJson(member.id,invite.code,"invited")
									
								}else{
									mdb.set(`invited.${member.id}`,invite.code)
							invites = await mdb.get(`invites`)
								}
								this.emit("UserInvited",member,await mdb.get(`invites.${invite.inviter.id}`) + 1,invite.inviter,invite)
            }
        })
    })
})
client.on('guildMemberRemove', async (member) => {
	let code = await mdb.get(`invited.${member.id}`)
	if(code === undefined) return this.emit("WARN","could not find the invite code of leaving member")
    member.guild.invites.fetch().then(async guildInvites => { 
        guildInvites.forEach(async invite => { 
					let name = await mdb.get(`invites.id${invite.code}`)
					let a = await mdb.get(`invites.${name}`)
					invites = await mdb.get(`invites`)
					invited = await mdb.get(`invited`)
					if(invite.code === code){
							mdb.set(`invites.${name}`,a-1)
							mdb.set(`invited.${member.id}`,undefined)
							this.emit("UserLeave",member,await mdb.get(`invites.${invite.inviter.id}`),invite.inviter,invite)
            }
        })
    })
})
	}
	async getInvites(member) {
		return (await(mdb.get(`invites.${member.id}`) === null ? 0 : await mdb.get(`invites.${member.id}`)))
	}
}