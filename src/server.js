const express = require('express')
const mysql = require('mysql')
const myconn = require ('express-myconnection')
const routes = require('./router')
const pdfs = require('./routerpdf')
const cors = require('cors')

const app = express();

app.use(cors({origin: 'http://localhost:4200'})) 
app.set('port',process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({extended : true}))


const dbOptions = {
    host: 'b6tdvmqqhr8wgku7h89i-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'ut1ijyaf9liworgo',
    password: 'dyO8YPrG1zo12nKodvX7',
    database: 'b6tdvmqqhr8wgku7h89i'
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