const express = require('express')
const mysql = require('mysql')
const myconn = require ('express-myconnection')
const routes = require('./router')
const pdfs = require('./routerpdf')
const cors = require('cors')

const app = express();

const config = require('./config.js')

app.use(cors({origin: 'http://localhost:4200'})) 
app.set('port',config.PORT);
app.use(express.json());
app.use(express.urlencoded({extended : true}))


const dbOptions = {
    host: config.HOST_MYSQL,
    port: config.PORT_MYSQ,
    user: config.USER_MYSQL,
    password: config.PASSWORD_MYSQL,
    database: config.DATABASE_MYSQL
}

//middlewares-------------------
app.use(myconn(mysql, dbOptions, 'single'))
app.use('/api',routes)
app.use('/pdfs',pdfs)
//routes 
app.get('/', (req,res)=>{
    res.send('Welcome to my api');
})

//server running 
app.listen(app.get('port'), () => {
    console.log('server is runnning in...',app.get('port'));
})