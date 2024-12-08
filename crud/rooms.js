const {dbConnection} = require('../database/database');

GetRooms = (res) => {
    dbConnection.query("SELECT * FROM Room", (err, data) => {
        res.send(data)
    })
}

GetRoom = (req, res) => {
    dbConnection.query(`SELECT * FROM Room WHERE id="${req.params.id}"`, (err,data) => {
        if (err) console.log(err)
        else {
            if (data.length == 0){
                res.status(418)
                res.send({err:"Room not found."})
            }else{
                res.send(data[0])
            }
        }
    })
}

DeleteRoom = (req,res) => {
    console.log(`DELETE FROM Room WHERE id="${req.params.id}"`)
    dbConnection.query(`DELETE FROM Room WHERE id="${req.params.id}"`, (err, data)=>{
        if (err) console.log(err)
        else {
            if (data.affectedRows == 1){
                res.send(true)
            }else{
                res.status(418)
                res.send(false)
            }
        }
    })
}

CreateRoom = (req, res) => {
    print(req.body.opkj)
    print(req.body.mode != undefined)
    if (req.body && req.body.name && req.body.slots && req.body.mode && req.body.password && req.body.owner){

        dbConnection.query(`SELECT * FROM User WHERE username='${req.body.owner}'`, (err, data) => {
            if (data.length == 1){
                dbConnection.query(`INSERT INTO Room (name, slots, mode, password, owner) VALUES ('${req.body.name}', ${req.body.slots}, ${req.body.mode}, '${req.body.password}', '${req.body.owner}')`, (err, data)=>{
                    if (err) console.log(err)
                    else
                        if (data.affectedRows == 1){
                            return res.send(true)
                        }else{
                            res.status(418)
                            return res.send(false)
                        }
                })
            }else{
                res.status(418)
                return res.send({err:"Invalid owner."})
            }
        })
    }else{
        res.status(418)
        res.send({err:"Missing parameters."})
    }
}

UpdateRoom = (req, res) => {
    // name / slots / mode / password
    if (req.body && (req.body.name || req.body.slots || req.body.mode || req.body.password)){

        dbConnection.query(`SELECT * FROM Room WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name) params += `name='${req.body.name}',`
                if (req.body.slots) params += `slots=${req.body.slots},`
                if (req.body.mode) params += `mode=${req.body.mode},`
                if (req.body.password) params += `password='${req.body.password}',`
                params = params.slice(0, -1)

                dbConnection.query(`UPDATE Room SET ${params} WHERE id=${req.params.id}`, (err, data) => {
                    if (err) console.log(err)
                    else {
                        if (data.affectedRows==0){
                            res.status(418)
                            res.send(false)
                        }else{
                            res.send(true)
                        }
                    }
                })
            }else{
                res.status(418)
                return res.send({err:"Invalid room."})
            }
        })
    }else{
        res.status(418)
        return res.send({err:"Wrong or missing parameters. (name || slots || mode || password)"})
    }
}

module.exports = {GetRoom, GetRooms, CreateRoom, DeleteRoom, UpdateRoom}