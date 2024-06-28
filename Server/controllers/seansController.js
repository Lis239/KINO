

const {Seans,Film, Zal} =require('../models/models')
const ApiError =require('../error/ApiError')
const { Op } = require('sequelize')


class SeanssController {

    async create(req, res, next) {
        try {
            let {date, time_start, duration, time_end, price, Vis, ZalIdZal, filmIdFilm} = req.body

            const seans = await Seans.create({date, time_start, duration, time_end, price, Vis, ZalIdZal, filmIdFilm});
            return res.json({seans:seans,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async getAll(req, res) {
        let {date,limit, page,searchtext} = req.query
        let seans;
        const isDat= date!==undefined
        const issearchtextt= searchtext!==""
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
//!!!!!!!!!!!!!!!!!!!!!! or issearchtextt

        if (!issearchtextt&&!isDat){

            seans = await Seans.findAndCountAll({limit, offset,order: [['date','desc']],include: [{model: Film},{model: Zal}]})

        }
        if (issearchtextt&&!isDat){
            seans = await Seans.findAndCountAll({
                limit,
                offset,
                order: [['date','desc']],

                include: [{model: Film,
                    where: {name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}},

                },{model: Zal,}]}
            )
        }

        if (!issearchtextt&&isDat){

            date=date.substring(0, 10)
            seans = await Seans.findAndCountAll({
                    limit,
                    offset,
                    order: [['date','desc']],
                    where: {date},
                    include: [{model: Film},{model: Zal}]
            }
            )
        }
        if (issearchtextt&&isDat){

            seans = await Seans.findAndCountAll({
                limit,
                offset,
                order: [['date','desc']],
                where: {date},
                    include: [{model: Film,
                        where:{ name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}},
                    },{model: Zal}]
            }
            )
        }

        return res.json({seans: seans,Cod:res.statusCode})
    }

    async getOne(req, res,next) {
        try {
            const {id} = req.params
            let id_seans = id
            const seans = await Seans.findOne(
                {
                    where: {id_seans},
                    include: [{model: Film},{model: Zal}]
                },
            )
            if (seans===null){
                return  next(ApiError.badReq('Сеанс отсутствует'))
            }
            return res.json({seans: seans, Cod: res.statusCode})
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
    async update(req, res, next) {
        try {
            const {id} = req.params
            let id_seans = id
            let {date, time_start, duration, time_end, price, Vis, ZalIdZal, filmIdFilm} = req.body
            const seans = await Seans.findOne(
                {
                    where: {id_seans},
                    include: [{model: Film},{model: Zal}]
                },
            ).then(seans=> seans.update({date:date,time_start:time_start, duration:duration, time_end:time_end,price: price,Vis:Vis,ZalIdZal:ZalIdZal,filmIdFilm:filmIdFilm},  {where:{id_seans:id_seans}}))
            return res.json({seans:seans,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
    async del(req,res,next){
        const {id} = req.params;
        const candidate=await Seans.findOne({where:{id_seans:id}})
        if(!candidate){
            return next(ApiError.badReq(`Смены с id ${id}  не существует`))
        }
        candidate.destroy()
        res.json({message:`Смена с id ${id} удалена`})
    }
}




module.exports = new SeanssController()