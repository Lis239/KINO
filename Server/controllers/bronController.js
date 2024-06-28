const {Bron,Seans,Bilet,Film,Zal,Users} =require('../models/models');
const ApiError =require('../error/ApiError');
const { Op,QueryTypes } = require("sequelize");
const crypto = require('crypto');
const jwt =require('jsonwebtoken')
const Sequelize = require('sequelize');
const {isEmpty} = require("../globalfunc/global");

function kod() {
    let randomBytes=crypto.randomBytes(3)
    return parseInt(randomBytes.toString('hex'), 16).toString().substr(0, 6)
}

class BronController {
    async create(req, res, next) {
        try {
            let { sposob, type_creater, date_create, time, mesto, sum, seanIdSeans} = req.body
            const token =req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.SK_SK)
            let kods=await kod()
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
            if(decoded.rol ==="user") {
                const BronAll = await Bron.findAndCountAll({
                    where: {
                        [Op.and]: [
                            {seanIdSeans: seanIdSeans},
                            {UserUserId: decoded.id},
                            {status:{[Op.ne]:"Отменен"} }
                        ]
                    }
                })
                if (BronAll.count >= 4) {
                    return next(ApiError.badReq(`Лимит бронирования на сеанс 4 места`))
                }
            }
            const seans = await Seans.findOne(
                {
                    where: {id_seans:seanIdSeans},
                    include: [{model: Film},{model: Zal}]
                },
            )

            let date_end=new Date(seans.date+"T"+seans.time_start+".000Z")
            date_end.setMinutes(date_end.getMinutes() - 15);
            date_end.setHours(date_end.getHours()-3);
            if (date_end<new Date){
                return next(ApiError.badReq(`Бронирование запрещено. C ${new Intl.DateTimeFormat("ru",{timeStyle: "medium"}).format(date_end)}`))
            }

            let status="Действует"
            const bron= await Bron.create({sposob, type_creater, date_create, time, mesto, sum, UserUserId:decoded.id, seanIdSeans,kod:kods,date_end,status});
            return res.json({bron:bron,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
    async getlimit(req, res, next){
        let {seanIdSeans} = req.query
        const token =req.headers.authorization.split(' ')[1]
        const decoded=jwt.verify(token,process.env.SK_SK)
        let BronAll;
        let limit=0;
        if(decoded.rol ==="user") {
            BronAll = await Bron.findAndCountAll({
                where: {
                    [Op.and]: [
                        {seanIdSeans: seanIdSeans},
                        {UserUserId: decoded.id},
                        {status:{[Op.ne]:"Отменен"} }
                    ]
                }
            })
            if (BronAll.count > 4) {
                return next(ApiError.badReq(`Лимит бронирования на сеанс 4 места`))
            }
            limit=4-BronAll.count
        }

        return res.json({limitbron:limit,Cod:res.statusCode})

    }

    async getAll(req, res) {
        let {id,date,mybron,limit, page,searchtext} = req.query
        let bron;
        let count=0;
        const isDat= isEmpty(date)
        const issearchtextt= isEmpty(searchtext)
        if (!isEmpty(id)){
            id=null
        }
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        const token =req.headers.authorization.split(' ')[1]
        const decoded=jwt.verify(token,process.env.SK_SK)
        mybron=mybron === 'true';
        console.log(req.query)
        console.log(id)
        console.log(isDat)
        console.log(issearchtextt)
        console.log("")
        console.log(mybron)
        console.log(decoded.rol!=="user")
        console.log(mybron && decoded.rol!=="user")
        if (!issearchtextt&!isDat){
            if(id!==null){
                console.log("+1")
                if (mybron&&decoded.rol!=="user"){
                    bron = await Bron.findAndCountAll({
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
                        where:{UserUserId:id},

                    })
                }else {
                    bron = await Bron.findAndCountAll({
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
                        where:{UserUserId:decoded.id},
                    })
                }
            }else {
                console.log("+2")
                if (mybron&&decoded.rol!=="user"){
                    bron = await Bron.findAndCountAll({
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
                    })
                }
                else {
                    bron = await Bron.findAndCountAll({
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
                        where:{UserUserId:decoded.id},
                    })
                }
            }
        }

        if (issearchtextt && !isDat){
            if(id!==null){
                console.log("++1")
                if (mybron && decoded.rol!=="user"){
                    bron = await Bron.findAndCountAll({
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
                                    "MName"]},
                        ],  where: {UserUserId:id},
                    })
                }else {
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+") LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );


                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\" ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+")",
                        {type: QueryTypes.SELECT}
                    );
                }
            }else {
                console.log("++2")
                if (mybron && decoded.rol!=="user"){
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' ) LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );


                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\" ILIKE '%"+searchtext+"%')",
                        {type: QueryTypes.SELECT}
                    );
                }else {
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+" ) LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );


                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\" ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+")",
                        {type: QueryTypes.SELECT}
                    );
                }
            }
        }
        if (!issearchtextt && isDat){
            date=date.substring(0, 10)
            if(id!==null){
            console.log("+++1")
            if (mybron && decoded.rol!=="user"){
                bron = await Bron.findAndCountAll({
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
                        where: {UserUserId:id}
                    }
                )
            }else {
                bron = await Bron.findAndCountAll({
                        limit,
                        offset,
                        include: [{model: Seans, include: [
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
                        where:{UserUserId:decoded.id},

                        }
                    )
                }
            }else {
                console.log("+++2")
                if (mybron && decoded.rol!=="user"){
                    bron = await Bron.findAndCountAll({
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
                    bron = await Bron.findAndCountAll({
                            limit,
                            offset,
                            include: [{model: Seans, include: [
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
                            where:{UserUserId:decoded.id},

                        }
                    )
                }
            }
        }
        if (issearchtextt&&isDat){
            date = date.substring(0, 10)
            if(id!==null) {
                console.log("++++1")
                if (mybron && decoded.rol !== "user") {
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+id+" AND \"sean\".\"date\"='"+date+"') LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );
                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+id+" AND \"sean\".\"date\"='"+date+"')",
                        {type: QueryTypes.SELECT}
                    );
                } else {
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+" AND \"sean\".\"date\"='"+date+"') LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );
                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+" AND \"sean\".\"date\"='"+date+"')",
                        {type: QueryTypes.SELECT}
                    );
                }
            }else {
                console.log("++++2")

                if (mybron && decoded.rol !== "user") {
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"sean\".\"date\"='"+date+"') LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );
                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"sean\".\"date\"='"+date+"')",
                        {type: QueryTypes.SELECT}
                    );
                } else {
                    bron =await Bron.sequelize.query(
                        "SELECT \"bron\".\"id_bron\", \"bron\".\"kod\", \"bron\".\"sposob\", \"bron\".\"type_creater\", \"bron\".\"date_create\", \"bron\".\"time\", \"bron\".\"status\", \"bron\".\"date_end\", \"bron\".\"mesto\", \"bron\".\"sum\", \"bron\".\"createdAt\", \"bron\".\"updatedAt\", \"bron\".\"UserUserId\",\n" +
                        "\"bron\".\"seanIdSeans\", \"sean\".\"id_seans\" AS \"sean.id_seans\", \"sean\".\"date\" AS \"sean.date\", \"sean\".\"time_start\" AS \"sean.time_start\", \"sean\".\"duration\" AS \"sean.duration\", \"sean\".\"time_end\" AS \"sean.time_end\", \"sean\".\"price\" AS \"sean.price\",\n" +
                        "\"sean\".\"Vis\" AS \"sean.Vis\", \"sean\".\"createdAt\" AS \"sean.createdAt\", \"sean\".\"updatedAt\" AS \"sean.updatedAt\", \"sean\".\"ZalIdZal\" AS \"sean.ZalIdZal\", \"sean\".\"filmIdFilm\" AS \"sean.filmIdFilm\", \"sean->Zal\".\"id_zal\" AS \"sean.Zal.id_zal\",\n" +
                        "\"sean->Zal\".\"name\" AS \"sean.Zal.name\", \"sean->Zal\".\"mesta_count\" AS \"sean.Zal.mesta_count\", \"sean->Zal\".\"img\" AS \"sean.Zal.img\", \"sean->Zal\".\"createdAt\" AS \"sean.Zal.createdAt\", \"sean->Zal\".\"updatedAt\" AS \"sean.Zal.updatedAt\", \n" +
                        "\"sean->film\".\"id_film\" AS \"sean.film.id_film\", \"sean->film\".\"name\" AS \"sean.film.name\", \"sean->film\".\"date\" AS \"sean.film.date\", \"sean->film\".\"autor\" AS \"sean.film.autor\", \"sean->film\".\"description\" AS \"sean.film.description\", \"sean->film\".\"img\" AS\n" +
                        "\"sean.film.img\", \"sean->film\".\"createdAt\" AS \"sean.film.createdAt\", \"sean->film\".\"updatedAt\" AS \"sean.film.updatedAt\", CONCAT(\"User\".\"LName\",' ', \"User\".\"FName\",' ', \"User\".\"MName\") as FIO FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                        "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bron\".\"UserUserId\" = \"User\".\"user_id\" WHERE  (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+" AND \"sean\".\"date\"='"+date+"') LIMIT "+limit+" OFFSET "+offset+"",
                        {
                            type: QueryTypes.SELECT
                        }
                    );
                    count =await Bron.sequelize.query(
                        "SELECT count(\"bron\".\"id_bron\") AS \"count\" FROM \"brons\" AS \"bron\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bron\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN \"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" =\"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" WHERE (\"sean->film\".\"name\"  ILIKE '%"+searchtext+"%' AND \"bron\".\"UserUserId\" = "+decoded.id+" AND \"sean\".\"date\"='"+date+"')",
                        {type: QueryTypes.SELECT}
                    );
                }
            }
        }




        return res.json({bron,count,Cod:res.statusCode})
    }
    async buyBron(req, res, next) {
        try {
            let oplata=false
            const {id} = req.params
            const token =req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.SK_SK)
            if(decoded.rol ==="user") {
                const BronDetect = await Bron.findOne({
                    where: {
                        [Op.and]: [
                            {id_bron: id},
                            {UserUserId: decoded.id},
                            {status: "Действует"},
                        ]
                    }

                })
                if(BronDetect===null){
                    return next(ApiError.badReq("Бронирование не найдено"))
                }
                else {

                        let {number,mm,yy,name,cvc} = req.body
                        if(isEmpty(number)&&isEmpty(mm)&&isEmpty(yy)&&isEmpty(name)&&isEmpty(cvc)){
                            //тут полата через банк
                            oplata=true;//результат оплаты
                            if(oplata){
                               await Bilet.create({
                                   sposob:BronDetect.sposob,
                                   type_creater:BronDetect.type_creater,
                                   date_create:BronDetect.date_create,
                                   time:BronDetect.time,
                                   mesto:BronDetect.mesto,
                                   sum:BronDetect.sum,
                                   UserUserId:decoded.id,
                                   seanIdSeans:BronDetect.seanIdSeans});

                               await BronDetect.update({ status: "Подтвержден"})
                            }else {
                                return next(ApiError.badReq("Оплата не удалась"))
                            }
                        }

                }
            }
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
        return res.json({Cod:res.statusCode})
    }
    //отмена для всех и подтверждение для админа
    async updateBron(req, res, next) {
        try {
            const {id} = req.params
            const {metod}=req.body
            const {kode}=req.body
            const token =req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.SK_SK)
            if(decoded.rol ==="user") {
                const BronDetect = await Bron.findOne({
                    where: {
                        [Op.and]: [
                            {id_bron: Number(id)},
                            {UserUserId: Number(decoded.id)}
                        ]
                    }
                })
                console.log(BronDetect)
                if(BronDetect===null){
                    return next(ApiError.badReq("Бронирование не найдено"))
                }
                else{
                    await BronDetect.update({status: "Отменен"})

                }
            }
            if(decoded.rol !=="user") {
                if (metod===0){
                    const BronDetect = await Bron.findOne({
                        where: {id_bron: id}
                    })
                    if(BronDetect===null){
                        return next(ApiError.badReq("Бронирование не найдено"))
                    }
                    else {
                        await BronDetect.update({ status: "Отменен"})
                    }
                }
                if (metod===1){
                    const BronDetect = await Bron.findOne({
                        where: {
                            [Op.and]: [
                                {id_bron: id},
                                {status:{[Op.ne]: "Отменен"} }
                            ]
                        }

                    })
                    if(BronDetect===null){
                        return next(ApiError.badReq("Бронирование не найдено. Возможно ваша бронь отменена"))
                    }
                    else {
                        if(Number(BronDetect.kod)===Number(kode)){
                            await BronDetect.update({ status: "Подтвержден"})
                        }else{
                            return next(ApiError.badReq("Код не совпадает"))
                        }

                    }
                }
            }
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
        return res.json({Cod:res.statusCode})
    }
}
module.exports = new BronController()