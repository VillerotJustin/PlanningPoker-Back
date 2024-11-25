GetStories = (res) => {
    db.query("SELECT * FROM story", (err, data) => {
        res.send(data)
    })
}

GetStory = (req, res) => {
    db.query(`SELECT * FROM story WHERE id="${req.params.id}"`, (err,data) => {
        if (err) console.log(err)
        else {
            if (data.length == 0){
                res.status(418)
                res.send({err:"Story not found."})
            }else{
                res.send(data[0])
            }
        }
    })
}

DeleteStory = (req,res) => {
    console.log(`DELETE FROM story WHERE id="${req.params.id}"`)
    db.query(`DELETE FROM story WHERE id="${req.params.id}"`, (err, data)=>{
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

CreateStory = (req, res) => {
    if (req.body && req.body.name && req.body.description && req.body.value && req.body.roomId){

        db.query(`SELECT * FROM room WHERE id='${req.body.roomId}'`, (err, data) => {
            if (data.length == 1){
                db.query(`INSERT INTO story (name, description, value, roomId) VALUES ('${req.body.name}', ${req.body.description}, ${req.body.value}, '${req.body.roomId}')`, (err, data)=>{
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
                return res.send({err:"Invalid roomId."})
            }
        })
    }else{
        res.status(418)
        res.send({err:"Missing parameters."})
    }
}

UpdateStory = (req, res) => {
    // name / slots / mode / password
    if (req.body && (req.body.name || req.body.description || req.body.value || req.body.roomId)){

        db.query(`SELECT * FROM story WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name) params += `name='${req.body.name}',`
                if (req.body.description) params += `description=${req.body.description},`
                if (req.body.value) params += `value=${req.body.value},`
                params = params.slice(0, -1)

                db.query(`UPDATE story SET ${params} WHERE id=${req.params.id}`, (err, data) => {
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
                return res.send({err:"Invalid story."})
            }
        })
    }else{
        res.status(418)
        return res.send({err:"Wrong or missing parameters. (name || description || value)"})
    }
}