const {dbConnection} = require('../database/database');

GetStories = (res) => {
    dbConnection.query("SELECT * FROM Story", (err, data) => {
        res.send(data)
    })
}

GetStory = (req, res) => {
    dbConnection.query(`SELECT * FROM Story WHERE id="${req.params.id}"`, (err,data) => {
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
    console.log(`DELETE FROM Story WHERE id="${req.params.id}"`)
    dbConnection.query(`DELETE FROM Story WHERE id="${req.params.id}"`, (err, data)=>{
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

        dbConnection.query(`SELECT * FROM Room WHERE id='${req.body.roomId}'`, (err, data) => {
            if (data.length == 1){
                dbConnection.query(`INSERT INTO Story (name, description, value, roomId) VALUES ('${req.body.name}', ${req.body.description}, ${req.body.value}, '${req.body.roomId}')`, (err, data)=>{
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

        dbConnection.query(`SELECT * FROM Story WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name) params += `name='${req.body.name}',`
                if (req.body.description) params += `description=${req.body.description},`
                if (req.body.value) params += `value=${req.body.value},`
                params = params.slice(0, -1)

                dbConnection.query(`UPDATE Story SET ${params} WHERE id=${req.params.id}`, (err, data) => {
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

module.exports = {GetStory, GetStories, CreateStory, DeleteStory, UpdateStory}