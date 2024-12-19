const {dbConnection} = require('../database/database');

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Récupère toutes les histoires.
 *     responses:
 *       200:
 *         description: Une liste d'histoires.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   value:
 *                     type: integer
 *                   roomId:
 *                     type: integer
 */
GetStories = (res) => {
    dbConnection.query("SELECT * FROM Story", (err, data) => {
        res.send(data)
    })
}

/**
 * @swagger
 * /stories/{id}:
 *   get:
 *     summary: Récupère une histoire spécifique par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de l'histoire à récupérer.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Les détails de l'histoire.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 value:
 *                   type: integer
 *                 roomId:
 *                   type: integer
 *       418:
 *         description: Histoire introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Story not found.
 */
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

/**
 * @swagger
 * /stories/{id}:
 *   delete:
 *     summary: Supprime une histoire par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de l'histoire à supprimer.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès de la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Échec de la suppression ou histoire introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: false
 */
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

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Crée une nouvelle histoire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de l'histoire.
 *               description:
 *                 type: string
 *                 description: Une description de l'histoire.
 *               roomId:
 *                 type: integer
 *                 description: L'ID de la salle associée à l'histoire.
 *     responses:
 *       200:
 *         description: Succès de la création de l'histoire.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Paramètres manquants ou invalides.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Invalid roomId.
 */
CreateStory = (req, res) => {
    if (req.body != undefined && req.body.name != undefined && req.body.description != undefined && req.body.roomId != undefined){

        dbConnection.query(`SELECT * FROM Room WHERE id='${req.body.roomId}'`, (err, data) => {
            if (data.length == 1){
                dbConnection.query(`INSERT INTO Story (name, description, value, roomId) VALUES ('${req.body.name}', '${req.body.description}', -1, ${req.body.roomId})`, (err, data)=>{
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


/**
 * @swagger
 * /stories/{id}:
 *   put:
 *     summary: Met à jour une histoire existante par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de l'histoire à mettre à jour.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'histoire.
 *               description:
 *                 type: string
 *                 description: Nouvelle description de l'histoire.
 *               value:
 *                 type: integer
 *                 description: Nouvelle valeur de l'histoire.
 *               roomId:
 *                 type: integer
 *                 description: ID de la nouvelle salle associée.
 *     responses:
 *       200:
 *         description: Succès de la mise à jour de l'histoire.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Paramètres manquants ou histoire introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Invalid story.
 */
UpdateStory = (req, res) => {
    // name / slots / mode / password
    if (req.body != undefined && (req.body.name != undefined || req.body.description != undefined || req.body.value != undefined || req.body.roomId != undefined)){

        dbConnection.query(`SELECT * FROM Story WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name != undefined) params += `name='${req.body.name}',`
                if (req.body.description != undefined) params += `description='${req.body.description}',`
                if (req.body.value != undefined) params += `value=${req.body.value},`
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