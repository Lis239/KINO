const uuid = require('uuid');
const path = require('path');
const {Film,FilmInfo} =require('../models/models');
const ApiError =require('../error/ApiError');
const { Op } = require("sequelize");

class FilmController {
    async create(req, res, next) {
        try {
            let {name,date, autor, description, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const film = await Film.create({name,date, autor, description, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    FilmInfo.create({
                        title: i.title,
                        coment: i.coment,
                        filmIdFilm: film.id_film
                    }))}

            return res.json({film:film,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async getAll(req, res) {
        let {limit, page,searchtext} = req.query

        let film;
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        if (!searchtext){
             film = await Film.findAndCountAll({limit, offset,order: [['name','desc']]})
        }
        if (searchtext){
            film = await Film.findAndCountAll({
                limit,
                offset,
                order: [['name','desc']],
                where: {name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}}}
                )
        }

        return res.json({film: film,Cod:res.statusCode})
    }

    async getOne(req, res,next) {
        try {
            const {id} = req.params
            let id_film = id
            const film = await Film.findOne(
                {
                    where: {id_film},
                    include: [{model: FilmInfo, as: 'info'}]
                },
            )
            if (film===null){
                return  next(ApiError.badReq('Фильм отсутствует'))
            }
            return res.json({film: film, Cod: res.statusCode})
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }


    async update(req, res, next) {
        try {
            const {id} = req.params
            let id_film = id
            let fileName=''
            let {name,date, autor, description, info} = req.body
            if(req?.files){
                const {img} = req.files
                fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
            }
            const film=await Film.findOne({
                    where:{id_film:id_film},
                    include: [{model: FilmInfo, as: 'info'}]
            }).then(film=>{

                if (req.files){film.update({name:name,date:date, autor:autor, description:description,img: fileName},  {where:{id_film:id_film}})}
                else {film.update({name:name,date:date, autor:autor, description:description},  {where:{id_film:id_film}})}


                if (info) {
                    info = JSON.parse(info)

                    info.forEach(i =>{

                        FilmInfo.findOne({where:{id_info: i.number}}).then(fi1=>{
                            fi1.update({ title: i.title, coment: i.coment})}
                        ).catch(eee=>{
                                FilmInfo.create({title: i.title, coment: i.coment, filmIdFilm: id})}
                        )
                     })
                }
            }
        )
         return res.json({film:film,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async del_info(req, res, next) {
        const {id} = req.params;
        const candidate = await FilmInfo.findOne({where: {id_info: id}})
        candidate.destroy()
        return res.json({Cod:res.statusCode})
    }
}

module.exports = new FilmController()