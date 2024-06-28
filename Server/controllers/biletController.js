const {isEmpty} =require("../globalfunc/global");
const {Bilet,Bron,Seans,Film,Zal,Users} =require('../models/models');
const ApiError =require('../error/ApiError');
const { Op,QueryTypes } = require("sequelize");
const jwt =require('jsonwebtoken')
const Sequelize = require('sequelize');

class BiletController {


    async create(req, res, next) {
        try {
            let oplata=false
            let {sposob, type_creater, date_create, time, mesto, sum, seanIdSeans} = req.body
            const token =req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.SK_SK)
            let bilet;

            const seans = await Seans.findOne(
                {
                    where: {id_seans:seanIdSeans},
                    include: [{model: Film},{model: Zal}]
                },
            )

            let date_end=new Date(seans.date+"T"+seans.time_end+".000Z")
            date_end.setMinutes(date_end.getMinutes()-60);
            date_end.setHours(date_end.getHours()-3);
            if (date_end<new Date){
                return next(ApiError.badReq(`Покупка билетов закончена. C ${new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(date_end)}`))
            }

            if(decoded.rol !=="user"){
                const BiletF = await Bilet.findAndCountAll({
                    where: {
                        [Op.and]: [
                            {seanIdSeans: seanIdSeans},
                            {mesto: mesto}
                        ]
                    }
                })
                const BronF = await Bron.findAndCountAll({
                    where: {
                        [Op.and]: [
                            {seanIdSeans: seanIdSeans},
                            {mesto: mesto},
                            {status:{[Op.ne]:"Отменен"} }
                        ]
                    }
                })
                if (BronF.count>0 || BiletF.count>0){
                    return next(ApiError.badReq(`Место ${mesto}  уже занято`))
                }

                    bilet= await Bilet.create({sposob, type_creater, date_create, time, mesto, sum, UserUserId:decoded.id, seanIdSeans});
            }else {
                let {number,mm,yy,name,cvc} = req.body
                if(isEmpty(number)&&isEmpty(mm)&&isEmpty(yy)&&isEmpty(name)&&isEmpty(cvc)){
                    //тут полата через банк
                    oplata=true;//результат оплаты
                   if(oplata===true){
                       const BiletF = await Bilet.findAndCountAll({
                           where: {
                               [Op.and]: [
                                   {seanIdSeans: seanIdSeans},
                                   {mesto: mesto}
                               ]
                           }
                       })
                       const BronF = await Bron.findAndCountAll({
                           where: {
                               [Op.and]: [
                                   {seanIdSeans: seanIdSeans},
                                   {mesto: mesto},
                                   {status:{[Op.ne]:"Отменен"} }
                               ]
                           }
                       })
                       if (BronF.count>0 || BiletF.count>0){
                           return next(ApiError.badReq(`Место ${mesto}  уже занято`))
                       }
                       bilet= await Bilet.create({sposob, type_creater, date_create, time, mesto, sum, UserUserId:decoded.id, seanIdSeans});
                   }else {
                       return next(ApiError.badReq("Оплата не удалась"))
                   }
                }
            }
            return res.json({bilet:bilet,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async seansmesta(req, res, next){
        let mesta= [];
        try {
        let {seanIdSeans} = req.query
        const BiletF = await Bilet.findAndCountAll({
            where: {seanIdSeans: seanIdSeans},

        })
        const BronF = await Bron.findAndCountAll({
            where: {
                [Op.and]: [
                    {seanIdSeans: seanIdSeans},
                    {status:{[Op.ne]:"Отменен"} }
                ]}
        })
        Object.entries(BiletF.rows).forEach((entry) => {
            const [key,value] = entry;
            const {mesto}=value
            mesta.push(mesto)
        });
        Object.entries(BronF.rows).forEach((entry) => {
            const [key,value] = entry;
            const {mesto}=value
            mesta.push(mesto)
        });
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
        return res.json({mesta:mesta,Cod:res.statusCode})
    }

    async mymesta(req, res, next){
        let mestabuy= [];
        let mestabron= [];
        try {
            let {seanIdSeans} = req.query
            const token =req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.SK_SK)
            const BiletF = await Bilet.findAndCountAll({
                where: {[Op.and]: [{seanIdSeans: seanIdSeans},{UserUserId: decoded.id}]},
            })
            const BronF = await Bron.findAndCountAll({
                where: {
                    [Op.and]: [
                        {seanIdSeans: seanIdSeans},
                        {status:{[Op.ne]:"Отменен"}},
                        {UserUserId: decoded.id}
                    ]}
            })
            Object.entries(BiletF.rows).forEach((entry) => {
                const [key,value] = entry;
                const {mesto}=value
                mestabuy.push(mesto)
            });
            Object.entries(BronF.rows).forEach((entry) => {
                const [key,value] = entry;
                const {mesto}=value
                mestabron.push(mesto)
            });
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
        return res.json({mestabuy:mestabuy,mestabron:mestabron,Cod:res.statusCode})
    }

    async getAll(req, res) {
        let {date,mybilet,limit, page,searchtext} = req.query
        let bilet;
        let count=0;
        const isDat= isEmpty(date)
        const issearchtextt= isEmpty(searchtext)
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        const token =req.headers.authorization.split(' ')[1]
        const decoded=jwt.verify(token,process.env.SK_SK)
        mybilet=mybilet === 'true';
        console.log(req.query)
        console.log(isDat)
        console.log(issearchtextt)
        console.log("")
        console.log(mybilet)
        console.log(decoded.rol!=="user")
        console.log(mybilet && decoded.rol!=="user")

        try {

        if (!issearchtextt && !isDat){
            console.log("+")
            if (mybilet && decoded.rol!=="user"){
                console.log("тут 1")

                bilet = await Bilet.findAndCountAll({
                    limit,
                    offset,
                    include: [{model: Seans,include:[
                        {model: Zal},
                        {model: Film},
                        ]},
                        {model: Users,
                            attributes: ["LName",
                                "FName",
                                [Sequelize.literal("CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\")"),"FIO"],
                                "MName"]}
                    ],
                })
            }else {
                console.log("тут 2")
                bilet = await Bilet.findAndCountAll({
                    limit,
                    offset,
                    include: [  {model: Seans,include:[
                                {model: Zal},
                                {model: Film},
                                ]},
                        {model: Users,
                            attributes: ["LName",
                                "FName",
                                [Sequelize.literal("CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\")"),"FIO"],
                                "MName"]}
                    ],
                    where: {UserUserId:decoded.id},
                })
            }
        }

        if (issearchtextt&&!isDat){
            console.log("++")
            if (mybilet && decoded.rol!=="user"){
                bilet = await Bilet.findAndCountAll({
                    limit,
                    offset,
                    include: [{model: Seans,
                        include: [
                            {model: Zal},
                            {model: Film,where: {name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}}},
                            ]},
                        {model: Users,
                        attributes: ["LName",
                            "FName",
                            [Sequelize.literal("CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\")"),"FIO"],
                            "MName"]}
                        ]
                })
            }else {

                bilet =await Bilet.sequelize.query(

                "SELECT \"bilet\".\"id_bilet\", \"bilet\".\"sposob\", \"bilet\".\"type_creater\", \"bilet\".\"date_create\", \"bilet\".\"time\", \"bilet\".\"mesto\", \"bilet\".\"sum\", \"bilet\".\"createdAt\", \"bilet\".\"updatedAt\", \"bilet\".\"UserUserId\", \n" +
                    "\"bilet\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                    "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\", \n" +
                    "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                    "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS \n" +
                    "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                    "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bilet\".\"UserUserId\" = \"User\".\"user_id\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bilet\".\"UserUserId\" = "+decoded.id+") LIMIT "+limit+" OFFSET "+offset+"",
                    {
                        type: QueryTypes.SELECT
                    }
                );


                count =await Bilet.sequelize.query(
                    "SELECT count(\"bilet\".\"id_bilet\") AS \"count\" FROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\" ILIKE '%"+searchtext+"%' AND \"bilet\".\"UserUserId\" = "+decoded.id+")",
                    {type: QueryTypes.SELECT}
                );
                      }

        }


        if (!issearchtextt && isDat){
            console.log("+++")
            date=date.substring(0, 10)
            if (mybilet && decoded.rol!=="user"){
                bilet = await Bilet.findAndCountAll({
                        limit,
                        offset,
                        include: [{model: Seans,include:[
                            {model: Zal},
                            {model: Film}],

                            where: {date},
                        },
                            {model: Users,
                                attributes: ["LName",
                                    "FName",
                                    [Sequelize.literal("CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\")"),"FIO"],
                                    "MName"]}],
                    }
                )
            }else {
                bilet = await Bilet.findAndCountAll({
                        limit,
                        offset,
                        include: [{
                            model: Seans, include: [
                                {model: Zal},
                                {model: Film},
                                ],
                            where: {date: date},
                        },
                            {model: Users,
                                attributes: ["LName",
                                    "FName",
                                    [Sequelize.literal("CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\")"),"FIO"],
                                    "MName"]}],
                        where: {UserUserId:decoded.id},

                    }
                )
            }
        }
        if (issearchtextt&&isDat){
            console.log("++++")
            date=date.substring(0, 10)
            if (mybilet && decoded.rol!=="user"){
                bilet =await Bilet.sequelize.query(
                    "SELECT \"bilet\".\"id_bilet\", \"bilet\".\"sposob\", \"bilet\".\"type_creater\", \"bilet\".\"date_create\", \"bilet\".\"time\", \"bilet\".\"mesto\", \"bilet\".\"sum\", \"bilet\".\"createdAt\", \"bilet\".\"updatedAt\", \"bilet\".\"UserUserId\", \n" +
                    "\"bilet\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                    "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\", \n" +
                    "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                    "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS \n" +
                    "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                    "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bilet\".\"UserUserId\" = \"User\".\"user_id\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"sean\".\"date\"='"+date+"') LIMIT "+limit+" OFFSET "+offset+"",
                    {
                        type: QueryTypes.SELECT
                    }
                );

                count =await Bilet.sequelize.query(
                    "SELECT count(\"bilet\".\"id_bilet\") AS \"count\" FROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\" ILIKE '%"+searchtext+"%' AND \"sean\".\"date\"='"+date+"')",
                    {type: QueryTypes.SELECT}
                );
            }else {
                bilet =await Bilet.sequelize.query(
                    "SELECT \"bilet\".\"id_bilet\", \"bilet\".\"sposob\", \"bilet\".\"type_creater\", \"bilet\".\"date_create\", \"bilet\".\"time\", \"bilet\".\"mesto\", \"bilet\".\"sum\", \"bilet\".\"createdAt\", \"bilet\".\"updatedAt\", \"bilet\".\"UserUserId\", \n" +
                    "\"bilet\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                    "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\", \n" +
                    "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                    "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS \n" +
                    "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                    "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bilet\".\"UserUserId\" = \"User\".\"user_id\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bilet\".\"UserUserId\" = "+decoded.id+"  AND \"sean\".\"date\"='"+date+"') LIMIT "+limit+" OFFSET "+offset+"",
                    {
                        type: QueryTypes.SELECT
                    }
                );

                count =await Bilet.sequelize.query(
                    "SELECT count(\"bilet\".\"id_bilet\") AS \"count\" FROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\" ILIKE '%"+searchtext+"%' AND \"bilet\".\"UserUserId\" = "+decoded.id+" AND \"sean\".\"date\"='"+date+"')",
                    {type: QueryTypes.SELECT}
                );
            }
        }
        return res.json({bilet,count,Cod:res.statusCode})
    }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
}

module.exports = new BiletController()