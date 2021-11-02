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