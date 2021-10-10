const express = require('express');
const routes = express.Router()
const jwt = require('jsonwebtoken');
const path = require('path')

routes.use(express.json());
routes.use(express.urlencoded({extended: true}));

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

//GET USERS
routes.get('/',authenticateJWT, (req,res)=>{
    const {rol} = req.user;
    if (rol == 'Admin'){
        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
    
            conn.query('SELECT * FROM tusers',(err,rows)=>{
                if(err) return res.send(err);
                res.json(rows)
            })
        })
    }
    else{
        return res.sendStatus(403);
    }
})

//GET RESOLUCIONES
routes.get('/resoluciones',authenticateJWT, (req,res)=>{
    const {rol} = req.user;
    if (rol == 'Tramite'|| rol == 'Admin' || rol == 'Normal'){
        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
    
            conn.query('SELECT * FROM tresolucion',(err,rows)=>{
                if(err) return res.send(err);
                res.json(rows)
            })
        })
    }
    else{
        return res.sendStatus(403);
    }
    
})

//POST USERS
routes.post('/',authenticateJWT, (req,res)=>{

    const {rol} = req.user;
    console.log(req.body);
    if ( length(req.body.dni.length == 8)){
        if (rol == 'Admin'){
            req.getConnection((err, conn)=> {
                if(err) return res.send(err)
                conn.query('INSERT INTO tusers set ? ',[req.body],(err)=>{
                    if(err) return res.send(err);
                    res.send("true");
                })
            })
        }
        else{return res.sendStatus(403);}
    }else { res.send("Error! el DNI debe ser de 8 digitos")}
})

//POST RESOLUCIONES
routes.post('/resoluciones',authenticateJWT,(req,res)=>{
    const {rol} = req.user;
    if (rol == 'Admin' || rol == 'Tramites'){
        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('INSERT INTO tresolucion set ? ',[req.body],(err)=>{
                if(err) return res.send(err);
                res.send("true");
            })
        })
    }
    else {return res.sendStatus(403);}
})

//DELETE USER
routes.delete('/:dni',authenticateJWT, (req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin'){
        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('SELECT * FROM tusers WHERE dni= ? ',[req.params.dni],(err,rows)=>{
                if(err) return res.send(err);
                if (rows[0] == undefined) return res.send("no se encuentra el user");
                else{
                    conn.query('DELETE FROM tusers where dni = ? ',[req.params.dni],(err)=>{
                        if(err) return res.send(err);
                        return res.send("el user ha sido eliminado");
                    })
                }
            })
        })
    }
    else {return res.sendStatus(403);}

})

//DELETE RESOLUCIONES
routes.delete('/resoluciones/:numero',authenticateJWT, (req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin'){

        
        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('SELECT * FROM tresolucion WHERE numero= ? ',[req.params.numero],(err,rows)=>{
                if(err) return res.send(err);
                if (rows[0] == undefined) return res.send("no se encuentra la resolucion");
                else{
                    conn.query('DELETE FROM tresolucion where numero = ? ',[req.params.numero],(err)=>{
                        if(err) return res.send(err);
                        return res.send("la resolucion ha sido eliminado");
                    })
                }
            })
        })
    }
    else {return res.sendStatus(403);}
})

//ACTUALIZAR USER
routes.put('/:dni',authenticateJWT, (req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin'){

        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('UPDATE tusers set ? WHERE dni= ?',[req.body, req.params.dni],(err)=>{
                if(err) return res.send(err);
                res.send("el usuario ha sido actualizado correctamente");
            })
        })
    }
    else {return res.sendStatus(403);}

    
})

//ACTUALIZAR resolucion
routes.put('/resoluciones/:numero',authenticateJWT, (req,res)=>{
    const {rol} = req.user;
    if (rol == 'Admin' || rol =='Tramite'){

        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('UPDATE tresolucion set ? WHERE numero= ?',[req.body, req.params.numero],(err)=>{
                if(err) return res.send(err);
                res.send("el usuario ha sido actualizado correctamente");
            })
        })
    }
    else{return res.sendStatus(403);}
    
})

//RETORNA UNA PERSONA
routes.get('/:dni',authenticateJWT, (req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin'){

        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('SELECT * FROM tusers WHERE dni= ? ',[req.params.dni],(err,rows)=>{
                if(err) return res.send(err);
                res.json(rows[0]);
            })
        })
    }
    else{return res.sendStatus(403);}
})

//RETORNA UNA RESOLUCION
routes.get('/resoluciones/:numero',authenticateJWT,(req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin'|| rol =='Tramite'){

        req.getConnection((err, conn)=> {
            if(err) return res.send(err)
            conn.query('SELECT * FROM tresolucion WHERE numero= ? ',[req.params.numero],(err,rows)=>{
                if(err) return res.send(err);
                res.json(rows[0]);
            })
        })
    }
    else{return res.sendStatus(403);}

})

// LOGIN
routes.post('/login', (req,res)=>{
    const { correoElectronico, password} = req.body;
    req.getConnection((err,conn)=>{
        if (err) return res.send(err)
        conn.query('SELECT * FROM tusers WHERE correoElectronico= ? AND password = ?',[correoElectronico,password],(err,rows)=>{

            if (err) return res.send(err);
            else{
                if (rows[0]==undefined) return res.send("Error al poner usuario y/o contraseña")
                else {
                    const accessToken = jwt.sign({ nombres: rows[0].nombres, rol: rows[0].rol},accessTokenSecret);
                    res.json({
                        "nombres": rows[0].nombres,
                        "rol": rows[0].rol,
                        accessToken
                    })
                }
            } 
        })
    })
})

//FILTROS users
routes.get('/filtro/dni/:campos',authenticateJWT,(req,res)=>{
    const {rol} = req.user;

    if (rol == 'Admin'){
        const campos =req.params.campos.split('__');
        req.getConnection((err,conn)=>{
            conn.query ('SELECT * FROM tusers WHERE dni like ? ','%'+campos[0]+'%',(err,rows)=>{
                if (err) return res.send(err);
                res.json(rows);
            })
        })
    }
    else{return res.sendStatus(403);}
})

routes.get('/filtro/nombres/:campos',authenticateJWT,(req,res)=>{
    const {rol} = req.user;

    if (rol == 'Admin'){
        const campos =req.params.campos.split('__');
        req.getConnection((err,conn)=>{
            conn.query ('SELECT * FROM tusers WHERE nombres like  ?','%'+campos[0]+'%',(err,rows)=>{
                if (err) return res.send(err);
                res.json(rows);
            })
        })
    }
    else{return res.sendStatus(403);}
})

//FILTROS resoluciones
routes.get('/resoluciones/filtro/dni/:campos',authenticateJWT,(req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin' || rol =='Normal' || rol =='Tramite'){

        const campos =req.params.campos.split('__');
        req.getConnection((err,conn)=>{
            conn.query ('SELECT * FROM tresolucion WHERE dni LIKE ?','%'+campos[0]+'%',(err,rows)=>{
                if (err) return res.send(err);
                res.json(rows);
            })
        })
    }
    else {return res.sendStatus(403);}
})

//FILTROS resoluciones
routes.get('/resoluciones/filtro/numero/:campos',authenticateJWT,(req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin' || rol =='Normal' || rol =='Tramite'){

        const campos =req.params.campos.split('__');
        req.getConnection((err,conn)=>{
            conn.query ('SELECT * FROM tresolucion WHERE numero LIKE ?','%'+campos[0]+'%',(err,rows)=>{
                if (err) return res.send(err);
                res.json(rows);
            })
        })
    }
    else {return res.sendStatus(403);}
})

//FILTROS resoluciones
routes.get('/resoluciones/filtro/asunto/:campos',authenticateJWT,(req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin' || rol =='Normal' || rol =='Tramite'){

        const campos =req.params.campos.split('__');
        req.getConnection((err,conn)=>{
            conn.query ('SELECT * FROM tresolucion WHERE asunto like ? ','%'+campos[0]+'%',(err,rows)=>{
                if (err) return res.send(err);
                res.json(rows);
            })
        })
    }
    else {return res.sendStatus(403);}
})
//FILTROS resoluciones
routes.get('/resoluciones/filtro/fecha/:campos',authenticateJWT,(req,res)=>{

    const {rol} = req.user;
    if (rol == 'Admin' || rol =='Normal' || rol =='Tramite'){

        const campos =req.params.campos.split('__');
        req.getConnection((err,conn)=>{
            conn.query ('SELECT * FROM tresolucion WHERE fecha like ? ','%'+campos[0]+'%',(err,rows)=>{
                if (err) return res.send(err);
                res.json(rows);
            })
        })
    }
    else {return res.sendStatus(403);}
})
module.exports = routes
