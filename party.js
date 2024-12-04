const {dbConnection} = require('./database/database');


class Party {
    constructor(pm, roomId, owner){
        this.members = [owner]
        this.votes = new Map()
        this.countVotes = 1
        this.pm = pm
        this.id = roomId
        this.stories = []
        this.indexStory = 0
        dbConnection.query(`SELECT id,name,description FROM Story WHERE roomId=${roomId}`, (err, data) => {
            for (let story of data){
                this.stories.push(story)
            }
        })
    }

    start(){
        this.pm.sendTo(this.members,{
            "code":"PARTY_STARTED",
        })

        this.nextStory()
    }

    nextStory(){
        if (this.stories.length == this.indexStory){
            this.pm.sendTo(this.members,{
                "code":"PARTY_ENDED",
                "results":this.stories.map(item => [item.name, item.description, item.value]) // On retire id, on renvoie que name, desc et value
            })

            for (let story of this.stories){
                //id name desc value
                dbConnection.query(`UPDATE Story SET value = ${story.value} WHERE id = ${story.id}`, (err, data) => {
                    if (err) console.log(err)
                    console.log(data)
                })
            }


        }else{
            this.pm.sendTo(this.members,{
                "code":"PARTY_START_VOTE",
                "story":this.stories.map(item => [item.name, item.description])[this.indexStory]
            })
            this.countVotes = 1
            this.votes = new Map()
            this.indexStory++
        }

        
    }

    addMember(user){
        this.pm.sendTo(this.members,{
            "code":"PARTY_MEMBER_JOINED",
            "user":user
        })

        this.members.push(user)
    }

    delMember(user){
        this.members.splice(this.members.indexOf(user),1)

        if (this.members.length != 0){
            this.pm.sendTo(this.members,{
                "code":"PARTY_MEMBER_LEAVED",
                "user":user
            })
        }
    }

    voteMember(user, value){
        this.votes.set(user, value)

        this.pm.sendTo(this.members,{
            "code":"PARTY_MEMBER_HAS_VOTED",
            "user":user
        })

        if (this.votes.size == this.members.length){
            this.reveal()
        }
    }

    reveal(){
        this.pm.sendTo(this.members,{
            "code":"PARTY_MEMBER_REVEAL",
            "votes":Array.from(this.votes)
        })

        let res = this.strict_check()

        if (res >= 0){
            this.stories[this.indexStory-1].value = res
            this.nextStory()
        }else if (this.countVotes == 1){
            this.revote()
        }else{
            //black magic with differents modes
            let res = this.strict_check()
            if (res >= 0){
                this.nextStory()
            }else{
                this.revote()
            }
        }
    }

    revote(){
        this.countVotes++
        this.pm.sendTo(this.members,{
            "code":"PARTY_REVOTE",
            "numberOfRevote":this.countVotes
        })

        this.votes = new Map()
    }

    strict_check(){
        let votesValues = Array.from(this.votes.values()).filter(val => val != -1)
        if (votesValues.length == 0) return -1
        if (votesValues.every((val) => val == votesValues[0])){
            return votesValues[0]
        }else{
            return -1
        }
    }
    // 0 0.5 1 2 3 5 8 13 20 40 100 ? (-1)
    // PARTY_START_VOTE 
}

module.exports = Party