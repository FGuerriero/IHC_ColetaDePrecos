const axios = require("axios");
const express = require('express')
const multer = require('multer')
const fs = require("fs")
const Minio = require('minio');

const app = express()

//Tratativas de erros
const deleteByID = (id) => {
    axios({
        url: "https://vital-skin-api.hasura.app/v1/graphql",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': '8hpDTHHrjR9rFvkVuJei3AgG52UFZ069udaENYKNeB36p6V3K1I6VzXWaEK5RmVv'
        },
        data: {
            "operationName": "deleteById",
            "query": `
                mutation deleteById {
                    delete_skinImagesDB(where: {request_ID: {_eq: ${id}}}) {
                        affected_rows
                        returning {
                            body_area
                            comment
                            disease
                            location
                            request_ID
                            request_date
                            skin_photo
                        }
                    }
                }
            `
        }
    }).then( response =>{
        console.log("Deleted from DB: ", response.data.data.delete_skinImagesDB)
    })
}

//Apagando Local
const deleteLocalFile = (localFile) => {
    try{
        fs.unlinkSync(localFile)
        console.log("File removed:", localFile)
    }catch(err){
        console.error(err)
    }
}

//Minio Config
const minioClient = new Minio.Client({
    endPoint: 'fibo.mtjade-wi-1.fii-hpc.com',
    useSSL: false,
    accessKey: 'OCH2YD8GA8RPML5D417O',
    secretKey: '2vDO6ibvPGmuaHpHeKlrmi9QQXiGt1c1Uo0mDqw9'
});


app.post('/uploadimage', (req, res) => {
    
    let fileNewName

    //Multer Config
    const storage = multer.diskStorage({
        destination(req, file, callback){
            callback(null, './images')
        },
        filename(req, file, callback){
            fileNewName = `${Date.now()}_${file.originalname}`
            callback(null, fileNewName)
        }
    })
    const upload = multer({ storage }).single('img_file')

    //Gravando Local
    upload( req, res, err => {

        if(err){
            return res.status(500).send({"msg": `Error on image handling. Contact Administrator: ${err}`})
        }

        console.log("Arquivo Salvo: ", fileNewName)

        //Gravando dados no Banco de Dados
        axios({
            url: "https://vital-skin-api.hasura.app/v1/graphql",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': '8hpDTHHrjR9rFvkVuJei3AgG52UFZ069udaENYKNeB36p6V3K1I6VzXWaEK5RmVv'
            },
            data: {
                "operationName": "postSkinToDB",
                "query": `
                    mutation postSkinToDB{
                        insert_skinImagesDB_one(object: {
                            body_area: "${ req.body.body_area }", 
                            comment: "${ req.body.comment }", 
                            location: "${ req.body.location }", 
                            request_date: "${ req.body.request_date }", 
                            skin_photo: "https://fibo.mtjade-wi-1.fii-hpc.com/vitalskin/image/${ fileNewName }",
                            disease: "${ req.body.disease }"
                        }){
                            request_ID
                        }
                    }
                `
            }
        }).then( response => {
            if(!response.data.errors && response.status < 300 && response.status > 199){
                console.log('Success on writind on DB: ', response.data)

                //Gravando no Bucket
                minioClient.fPutObject('vitalskin', `image/${fileNewName}`, `./images/${fileNewName}`, {'Content-Type': 'image/*'}, function(err, objInfo) {
                    if(err) {
                        console.log("DB Error: ", err.code)
                        res.status(500).send({"msg": `Error on Bucket: ${err}(${err.code}). Contact Administrator.`})
                        deleteByID(response.data.data.insert_skinImagesDB_one.request_ID)
                        deleteLocalFile(`./images/${fileNewName}`)
                        return
                    }
                    
                    console.log("Success", objInfo.etag, objInfo.versionId)
                    res.status(200).send({"msg":"Image successfully sent!"})
                    deleteLocalFile(`./images/${fileNewName}`)
                })
            }else {
                res.status(500).send({"msg":"Error while writing on DB. Contact administrator."})
                deleteLocalFile(`./images/${fileNewName}`)
            }
        }).catch( (err) => {
            console.log("Error after writing on DB: ", err)
            res.status(500).send({"msg": `Error on image handling. Contact Administrator: ${err}`})
            deleteLocalFile(`./images/${fileNewName}`)
        })
    })
})

app.get('/', (req, res) => {
    res.send("Done!")
})

app.listen(8080, () => {
    console.log("Running Server...")
})