GetRooms = (req, res) => {
    db.query("SELECT * FROM room", (err, data) => {
        res.send(data)
    })
}

GetRoom = (req, res) => {
    db.query(`SELECT * FROM room WHERE id="${req.params.id}"`, (err,data) => {
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
    console.log(`DELETE FROM room WHERE id="${req.params.id}"`)
    db.query(`DELETE FROM room WHERE id="${req.params.id}"`, (err, data)=>{
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
    if (req.body && req.body.name && req.body.slots && req.body.mode && req.body.password && req.body.owner){

        db.query(`SELECT * FROM user WHERE username='${req.body.owner}'`, (err, data) => {
            if (data.length == 1){
                db.query(`INSERT INTO room (name, slots, mode, password, owner) VALUES ('${req.body.name}', ${req.body.slots}, ${req.body.mode}, '${req.body.password}', '${req.body.owner}')`, (err, data)=>{
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

        db.query(`SELECT * FROM room WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name) params += `name='${req.body.name}',`
                if (req.body.slots) params += `slots=${req.body.slots},`
                if (req.body.mode) params += `mode=${req.body.mode},`
                if (req.body.password) params += `password='${req.body.password}',`
                params = params.slice(0, -1)

                db.query(`UPDATE room SET ${params} WHERE id=${req.params.id}`, (err, data) => {
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