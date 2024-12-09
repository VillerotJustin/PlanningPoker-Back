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
    if (req.body != undefined && req.body.name != undefined && req.body.mode != undefined && req.body.password != undefined && req.body.owner != undefined){

        dbConnection.query(`SELECT * FROM User WHERE username='${req.body.owner}'`, (err, data) => {
            if (data.length == 1){
                dbConnection.query(`INSERT INTO Room (name, mode, password, owner) VALUES ('${req.body.name}', ${req.body.mode}, '${req.body.password}', '${req.body.owner}')`, (err, data)=>{
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
    if (req.body != undefined && (req.body.name != undefined || req.body.mode != undefined || req.body.password != undefined)){

        dbConnection.query(`SELECT * FROM Room WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name != undefined) params += `name='${req.body.name}',`
                if (req.body.mode != undefined) params += `mode=${req.body.mode},`
                if (req.body.password != undefined) params += `password='${req.body.password}',`
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
        return res.send({err:"Wrong or missing parameters. (name || mode || password)"})
    }
}

StoriesOfRoom = (req, res) => {
    dbConnection.query(`SELECT * FROM Story WHERE roomId="${req.params.id}"`, (err,data) => {
        if (err) console.log(err)
        else {
            res.send(data)
        }
    })
}

module.exports = {GetRoom, GetRooms, CreateRoom, DeleteRoom, UpdateRoom, StoriesOfRoom}