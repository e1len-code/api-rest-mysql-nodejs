const express = require ('express');
const pdfs = express.Router();
const path = require('path');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const multipart = require('connect-multiparty');
const fs = require('fs');
const multipartMiddleware = multipart({
    uploadDir: './public/upload',
    
});

const authenticateJWT = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if (authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token,accessTokenSecret, (err,user)=>{
            if (err){
                return res.sendStatus(403);
            }
            req.user=user;
            next();
        })
    }
    else{
        res.sendStatus(401);
    }
    
}


const accessTokenSecret="tokenUgelUrubamba";


pdfs.use(express.json());
pdfs.use(express.urlencoded({extended: true}));

pdfs.get('/',(req,res)=>{
    return res.send('This is a home page');
});

pdfs.post('/subir',authenticateJWT,multipartMiddleware,(req,res)=>{

    //console.log('Storage location is:' +req.hostname+'\/'+req.file.path);
    console.log(req.files);
    var file=(req.files.null.originalFilename).trim();
    fs.rename(req.files.null.path, path.join(req.files.null.path,'..',req.files.null.originalFilename), function(err) {
    if ( err ) console.log('ERROR: ' + err);
    });
    return res.json({"direccion": path.join(__dirname,'..',req.files.null.path,'..',file)});
});

module.exports = pdfs;