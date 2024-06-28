const {Smena} =require('../models/models')
const ApiError =require('../error/ApiError')
const { Op } = require('sequelize')


class SmenaController {

    async getOne(req, res,next) {
        try {
            const {id} = req.params
            let id_smena = id
            const smena = await Smena.findOne(
                {
                    where: {id_smena}
                },
            )
            if (smena===null){
                return  next(ApiError.badReq('Смена отсутствует'))
            }
            return res.json({smena: smena, Cod: res.statusCode})
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async create(req, res, next) {
        try {
            let {name,info} = req.body
            const smena = await Smena.create({name,info});
            return res.json({smena:smena,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async getAll(req, res) {

        let {searchtext} = req.query
        let smena;
        if (!searchtext){
            smena = await Smena.findAndCountAll({order: [['name','desc']]})
        }
        if (searchtext){
            smena = await Smena.findAndCountAll({
                order: [['name','desc']],
                where: {name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}}}
            )
        }
        return res.json({smena: smena,Cod:res.statusCode})
    }


    async update(req, res, next) {
        try {
            const {id} = req.params
            let id_smena = id
            let {name,info} = req.body
            const smena=await Smena.findOne({
                where:{id_smena:id_smena},
            }).then(smena=>{
                     smena.update({name:name,info:info},  {where:{id_smena:id_smena}})
                }
            )
            return res.json({smena:smena,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
    async del(req,res,next){
        const {id} = req.params;
        const candidate=await Smena.findOne({where:{id_smena:id}})
        if(!candidate){
            return next(ApiError.badReq(`Смена с id ${id}  не существует`))
        }
        candidate.destroy()
        res.json({message:`Смена с id ${id} удален`})
    }

}




module.exports = new SmenaController()