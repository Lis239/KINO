const {Seans,Film,Zal} =require('../models/models')
const ApiError =require('../error/ApiError')
const { Op } = require('sequelize')
const { Sequelize } = require("sequelize");

class MainController {
    async All(req, res, next) {
        try {
            let {limit, page} = req.query
            let {searchtext}=req.body
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            let seans;
            let DATE=new Date(new Date().setHours(3,0,0)).toISOString().substring(0,10)

            if (!searchtext){
                seans = await Seans.findAndCountAll({
                    limit,
                    offset,
                    order: [['d_date', 'ASC']],
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('seans.date')), 'd_date'],
                        'filmIdFilm'
                    ],
                    where:{
                        date:{[Op.gte]:DATE}
                    },
                    include: [{model: Film}],
                    group: ['filmIdFilm', 'seans.date', 'film.id_film']
                });
            }
            if (searchtext){
                seans = await Seans.findAndCountAll({
                    limit,
                    offset,
                    order: [['d_date', 'ASC']],
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('seans.date')), 'd_date'],
                        'filmIdFilm'
                    ],
                    where: {date:{[Op.gte]:DATE}},
                    include: [{
                        model: Film,
                        where: {name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}}
                    }],
                    group: ['filmIdFilm', 'seans.date', 'film.id_film']
                });
            }
            let count = seans.count.length;
            return res.json({seans:seans,count:count,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }


    async getOne(req, res,next) {
        try {
            const {id} = req.params
            const {date} = req.params
            console.log("+++++++++++++++")
            let seans = await Seans.findAndCountAll({
                order: [['time_start', 'ASC']],
                where:{
                    [Op.and]: [{date:{[Op.eq]:date}},{filmIdFilm:{[Op.eq]:id}}]
                },
                include: [{model: Film},{model: Zal}],
            });
            if (seans===null){
                return  next(ApiError.badReq('Пока здесь пусто'))
            }
            return res.json({seans: seans, Cod: res.statusCode})
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
}

module.exports = new MainController()