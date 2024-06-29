require('dotenv').config()
const express=require('express')
const sequelize=require('./db')
const models =require('./models/models')
const cors =require('cors')
const router=require('./routes/index')
const port=process.env.port||5050

const {Bron} =require('./models/models');
const { Op } = require("sequelize");

const app=express()
const fileupload=require('express-fileupload')
const errorHandler=require('./middleware/ErrorHandlingMiddleware')
const path=require('path')

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(express.static(path.resolve(__dirname,'static_zal')))
app.use(fileupload({}))


app.use('/api',router)

app.use(errorHandler)

const start=async ()=>{
    try {
        await  sequelize.authenticate()
        await  sequelize.sync()
        app.listen(port,()=>console.log(`Server start on port ${port}`))
        setInterval(loop, 1000*60*5);
    }catch (e) {
        console.log(e)
    }
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
const loop=async ()=>{
    try {
        let calDate=new Date(new Date().addHours(3))
        const BronDetect = await Bron.findAll({
            where: {
                [Op.and]: [
                    {date_end: {[Op.lt]:calDate}},
                    {status: "Действует"},
                ]
            }

        }).then(
            function(items) {
                items.forEach(function(t) {
                    t.update({ status: "Отменен"});
                });
            }
        )
    }catch (e) {
        console.log(e)
    }
}


start()