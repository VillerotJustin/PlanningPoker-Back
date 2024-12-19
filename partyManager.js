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
        console.log("Websocket listening on port: "+process.env.SOCKET_PORT) 

    }

    sendTo(clientsId, message){
        console.log("send: "+message+" /To: "+ clientsId)
        let json = JSON.stringify(message)
        for (let id of clientsId){
            let connection = this.clients[id].connection
            connection.send(json)
        }
    }

    idauthToParty(idauth){
        console.log("idauthToParty: "+ idauth)
        for (let party of this.parties.values()){
            if (party.members.includes(idauth)) return party
        }
        return -1
    }

    messageHandler(message, idauth){
        if (message=="") {
            console.log("Message Empty");
            return;
        }
        console.log("messageHandler: |\n"+message+"\n| By: "+ idauth)

        let json
        // parsing Message with error handling
        try {
            json = JSON.parse(message);
            console.log(json);
        } catch (e) {
            console.error("Invalid JSON:", e);
            this.sendTo([idauth], "Invalid Json")
            return;
        }
        if (json.code == undefined) return;
        console.log(json)

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
                    this.parties.delete(party.id)
                }
                break;
            case 'PARTY_VOTE':
                party.voteMember(idauth, json.vote)
                break;
            case 'PARTY_INFO':
                this.sendTo([idauth], {code: "PARTY_INFO_RESULT", info:party.getInfo()})
                break;
            case 'PARTY_FETCH':
                let parties = []
                for (let party of this.parties.values()){
                    if (party.state == "WAITING") parties.push(party.getInfo())
                }
                this.sendTo([idauth], {code: "PARTY_FETCH_RESULT", parties:parties})
                break;
            case 'PARTY_RECIEVE_MESSAGE':
                party.chat(json.message)
                break;
        }
    }
}

let pm = new PartyManager()

module.exports = pm