const ws = require('ws')

const Party = require('./party')

require('dotenv').config();

class PartyManager {
    constructor(){
        this.parties = new Map()
        this.socket = new ws.WebSocketServer({ port: process.env.SOCKET_PORT })
        this.clients = []
        this.socket.on('connection', (socket) => {
            socket.on('error', console.error);
            let id = this.clients.push({connection: socket, room:-1}) -1

            socket.on('message', (message) => this.messageHandler(message, id))
            

            socket.send(JSON.stringify({"OK":true}));
        });
    }

    sendTo(clientsId, message){
        let json = JSON.stringify(message)
        for (let id of clientsId){
            let connection = this.clients[id].connection
            connection.send(json)
        }
    }

    idauthToParty(idauth){
        for (let party of this.parties.values()){
            if (party.members.includes(idauth)) return party
        }
        return -1
    }

    messageHandler(message, idauth){
        let json = JSON.parse(message)
        if (!json.code) return;

        let party = this.idauthToParty(idauth)

        switch (json.code){
            case 'PARTY_CREATE':
                if (this.parties.has(json.id)) return;
                this.parties.set(json.id, new Party(this, json.id, idauth))
                break;
            case 'PARTY_START':
                party.start()
                break;
            case 'PARTY_JOIN':
                if (party == -1){
                    this.parties.get(json.id).addMember(idauth)
                }
                break;
            case 'PARTY_LEAVE':
                party.delMember(idauth)
                if (party.members.length == 0){ // On supprime la party si y a plus personne
                    this.parties.delete(id)
                }
                break;
            case 'PARTY_VOTE':
                party.voteMember(idauth, json.vote)
                break;
        }
    }
}

let pm = new PartyManager()

module.exports = pm