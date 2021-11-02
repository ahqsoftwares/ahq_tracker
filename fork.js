    // npm publish --access public
    var EventEmitter = require('events')
    const Database = require("easy-json-database");
    const db = new Database("./ahq.json", {
        snapshots: {
            enabled: false,
            interval: 24 * 60 * 60 * 1000,
            folder: './backups/'
        }
    });

    function aJson(input,value,database,type){
    	if(type){
    let a = db.get(database)
    let text = JSON.stringify(a)
    let text2 = text.replace('}',"")
    if(text2 === "{"){
    let texta = `{"${input}":${value}}`
    db.set(database,JSON.parse(texta))
    return true
    }else{
    let texta = `${text2},"${input}":${value}}`
    db.set(database,JSON.parse(texta))
    return true
    }
    	}else{
    let a = db.get(database)
    let text = JSON.stringify(a)
    let text2 = text.replace('}',"")
    if(text2 === "{"){
    let texta = `{"${input}":"${value}"}`
    db.set(database,JSON.parse(texta))
    return true
    }else{
    let texta = `${text2},"${input}":"${value}"}`
    db.set(database,JSON.parse(texta))
    return true
    }
    }
    }
    module.exports = class Invite extends EventEmitter{
    	constructor(client){
    		super();
    		if(!db.get(`invites`)){
    			db.set('invites',{})
    		}	
    		if(!db.get(`invited`)){
    			db.set('invited',{})
    		}
    		let invites = db.get(`invites`)
    		let invited = db.get(`invited`)
    		let event = new EventEmitter
    		client.on('ready', () => {
        client.guilds.cache.forEach(async guild => { 
            guild.invites.fetch().then(async guildInvites => {
              guildInvites.forEach(async guildInvite => {
    						if(db.get(`invites.${guildInvite.inviter.id}`) !== undefined){
    							db.set(`invites.${guildInvite.inviter.id}`,0)
    							invites = db.get(`invites`)
    							let b = db.get(`invites.${guildInvite.inviter.id}`) === null ? 0 : db.get(`invites.${guildInvite.inviter.id}`)
    							let c = b === undefined ? 0 : b
    							let d = Number(c)
    							let a = d + guildInvite.uses
    							console.log(a)
    							db.set(`invites.${guildInvite.inviter.id}`,a)
    							invites = db.get(`invites`)
    						}else{
    						aJson(guildInvite.inviter.id,Number(guildInvite.uses),"invites","number")
    						invites = db.get(`invites`)
    						
    						}
    						aJson(`id${guildInvite.code}`,guildInvite.inviter.id,"invites")
    						aJson(guildInvite.code,guildInvite.uses,"invites")
    						invites = db.get(`invites`)
              })
            })
        })
    }) 
    client.on('inviteCreate', (guildInvite) => { 
    						if(db.get(`${guildInvite.inviter.id}`) !== undefined){
    							let a = Number(db.get(`${guildInvite.inviter.id}`)) + Number(guildInvite.uses)
    							db.set(`invites.${guildInvite.inviter.id}`,a)
    							invites = db.get(`invites`)
    						}else{
    						aJson(guildInvite.inviter.id,Number(guildInvite.uses),"invites","number")
    						invites = db.get(`invites`)
    						}
    						aJson(`id${guildInvite.code}`,guildInvite.inviter.id,"invites")
    						aJson(guildInvite.code,guildInvite.uses,"invites")
    						invites = db.get(`invites`)
    })

    client.on('guildMemberAdd', async (member) => {
        member.guild.invites.fetch().then(async guildInvites => { 
            guildInvites.forEach(invite => { 
                if(invite.uses != db.get(`invites.${invite.code}`)) { 
    								    client.guilds.cache.forEach(async guild => { 
    										guild.invites.fetch().then(async guildInvites2 => {
    											guildInvites2.forEach(async guildInvite3 => {
    																		if(db.get(`${guildInvite3.inviter.id}`) !== undefined){
    							let a = Number(db.get(`${guildInvite3.inviter.id}`)) + Number(guildInvite3.use)
    							db.set(`invites.${guildInvite3.inviter.id}`,a)
    							invites = db.get(`invites`)
    						}else{
    						aJson(guildInvite3.inviter.id,Number(guildInvite3.uses),"invites","number")
    						invites = db.get(`invites`)
    						}
    						aJson(`id${guildInvite3.code}`,guildInvite3.inviter.id,"invites")
    						aJson(guildInvite3.code,guildInvite3.uses,"invites")
    						invites = db.get(`invites`)
    											})
    										})
    								})
    								if(db.get(`invited`) === "{}"){
    									aJson(member.id,invite.code,"invited")
    									invited = db.get('invited')
    								}else{
    									db.set(`invited.${member.id}`,invite.code)
    							invites = db.get(`invites`)
    								}
    								this.emit("UserInvited",member,db.get(`invites.${invite.inviter.id}`) + 1,invite.inviter,invite)
                }
            })
        })
    })
    client.on('guildMemberRemove', async (member) => {
    	let code = db.get(`invited.${member.id}`)
    	if(code === undefined) return this.emit("WARN","could not find the invite code of leaving member")
        member.guild.invites.fetch().then(async guildInvites => { 
            guildInvites.forEach(invite => { 
    					if(invite.code === code){
    							let name = db.get(`invites.id${invite.code}`)
    							let a = db.get(`invites.${name}`)
    							db.set(`invites.${name}`,a-1)
    							invites = db.get(`invites`)
    							db.set(`invited.${member.id}`,undefined)
    							invited = db.get(`invited`)
    								this.emit("UserLeave",member,db.get(`invites.${invite.inviter.id}`),invite.inviter,invite)
                }
            })
        })
    })
    	}
    	getInvites(member){
    		return db.get(`invites.${member.id}`) === null ? 0 : db.get(`invites.${member.id}`)
    	}
    }