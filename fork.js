    // npm publish --access public
    var EventEmitter = require('events')
    const {DB} = require("quickmongo");
    const DATABASE = new DB(process.env.INVITES, {
        snapshots: {
            interval: 24 * 60 * 60 * 1000,
            folder: './backups/'
        }
    });

    function aJson(input,value,database,type){
    	if(type){
    let a = DATABASE.get(database)
    let text = JSON.stringify(a)
    let text2 = text.replace('}',"")
    if(text2 === "{"){
    let texta = `{"${input}":${value}}`
    DATABASE.set(database,JSON.parse(texta))
    return true
    }else{
    let texta = `${text2},"${input}":${value}}`
    DATABASE.set(database,JSON.parse(texta))
    return true
    }
    	}else{
    let a = DATABASE.get(database)
    let text = JSON.stringify(a)
    let text2 = text.replace('}',"")
    if(text2 === "{"){
    let texta = `{"${input}":"${value}"}`
    DATABASE.set(database,JSON.parse(texta))
    return true
    }else{
    let texta = `${text2},"${input}":"${value}"}`
    DATABASE.set(database,JSON.parse(texta))
    return true
    }
    }
    }
    module.exports = class Invite extends EventEmitter{
    	constructor(client){
    		super();
    		if(!DATABASE.get(`invites`)){
    			DATABASE.set('invites',{})
    		}	
    		if(!DATABASE.get(`invited`)){
    			DATABASE.set('invited',{})
    		}
    		let invites = DATABASE.get(`invites`)
    		let invited = DATABASE.get(`invited`)
    		let event = new EventEmitter
    		client.on('ready', () => {
        client.guilds.cache.forEach(async guild => { 
            guild.invites.fetch().then(async guildInvites => {
              guildInvites.forEach(async guildInvite => {
    						if(DATABASE.get(`invites.${guildInvite.inviter.id}`) !== undefined){
    							DATABASE.set(`invites.${guildInvite.inviter.id}`,0)
    							invites = DATABASE.get(`invites`)
    							let b = DATABASE.get(`invites.${guildInvite.inviter.id}`) === null ? 0 : DATABASE.get(`invites.${guildInvite.inviter.id}`)
    							let c = b === undefined ? 0 : b
    							let d = Number(c)
    							let a = d + guildInvite.uses
    							console.log(a)
    							DATABASE.set(`invites.${guildInvite.inviter.id}`,a)
    							invites = DATABASE.get(`invites`)
    						}else{
    						aJson(guildInvite.inviter.id,Number(guildInvite.uses),"invites","number")
    						invites = DATABASE.get(`invites`)
    						
    						}
    						aJson(`id${guildInvite.code}`,guildInvite.inviter.id,"invites")
    						aJson(guildInvite.code,guildInvite.uses,"invites")
    						invites = DATABASE.get(`invites`)
              })
            })
        })
    }) 
    client.on('inviteCreate', (guildInvite) => { 
    						if(DATABASE.get(`${guildInvite.inviter.id}`) !== undefined){
    							let a = Number(DATABASE.get(`${guildInvite.inviter.id}`)) + Number(guildInvite.uses)
    							DATABASE.set(`invites.${guildInvite.inviter.id}`,a)
    							invites = DATABASE.get(`invites`)
    						}else{
    						aJson(guildInvite.inviter.id,Number(guildInvite.uses),"invites","number")
    						invites = DATABASE.get(`invites`)
    						}
    						aJson(`id${guildInvite.code}`,guildInvite.inviter.id,"invites")
    						aJson(guildInvite.code,guildInvite.uses,"invites")
    						invites = DATABASE.get(`invites`)
    })

    client.on('guildMemberAdd', async (member) => {
        member.guild.invites.fetch().then(async guildInvites => { 
            guildInvites.forEach(invite => { 
                if(invite.uses != DATABASE.get(`invites.${invite.code}`)) { 
    								    client.guilds.cache.forEach(async guild => { 
    										guild.invites.fetch().then(async guildInvites2 => {
    											guildInvites2.forEach(async guildInvite3 => {
    																		if(DATABASE.get(`${guildInvite3.inviter.id}`) !== undefined){
    							let a = Number(DATABASE.get(`${guildInvite3.inviter.id}`)) + Number(guildInvite3.use)
    							DATABASE.set(`invites.${guildInvite3.inviter.id}`,a)
    							invites = DATABASE.get(`invites`)
    						}else{
    						aJson(guildInvite3.inviter.id,Number(guildInvite3.uses),"invites","number")
    						invites = DATABASE.get(`invites`)
    						}
    						aJson(`id${guildInvite3.code}`,guildInvite3.inviter.id,"invites")
    						aJson(guildInvite3.code,guildInvite3.uses,"invites")
    						invites = DATABASE.get(`invites`)
    											})
    										})
    								})
    								if(DATABASE.get(`invited`) === "{}"){
    									aJson(member.id,invite.code,"invited")
    									invited = DATABASE.get('invited')
    								}else{
    									DATABASE.set(`invited.${member.id}`,invite.code)
    							invites = DATABASE.get(`invites`)
    								}
    								this.emit("UserInvited",member,DATABASE.get(`invites.${invite.inviter.id}`) + 1,invite.inviter,invite)
                }
            })
        })
    })
    client.on('guildMemberRemove', async (member) => {
    	let code = DATABASE.get(`invited.${member.id}`)
    	if(code === undefined) return this.emit("WARN","could not find the invite code of leaving member")
        member.guild.invites.fetch().then(async guildInvites => { 
            guildInvites.forEach(invite => { 
    					if(invite.code === code){
    							let name = DATABASE.get(`invites.id${invite.code}`)
    							let a = DATABASE.get(`invites.${name}`)
    							DATABASE.set(`invites.${name}`,a-1)
    							invites = DATABASE.get(`invites`)
    							DATABASE.set(`invited.${member.id}`,undefined)
    							invited = DATABASE.get(`invited`)
    								this.emit("UserLeave",member,DATABASE.get(`invites.${invite.inviter.id}`),invite.inviter,invite)
                }
            })
        })
    })
    	}
    	getInvites(member){
    		return DATABASE.get(`invites.${member.id}`) === null ? 0 : DATABASE.get(`invites.${member.id}`)
    	}
    }