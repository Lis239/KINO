const {Smena_Sotr,Smena,Users} =require('../models/models')
const ApiError =require('../error/ApiError')
const { Op } = require('sequelize')



class SmenaSotrController {
    async create(req, res, next) {
        try {
            let {date,smenaIdSmena,UserUserId} = req.body
            const smenasotr = await Smena_Sotr.create({date,smenaIdSmena,UserUserId});
            return res.json({smenasotr:smenasotr,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async getAll(req, res) {
        const {date}= req.query
        let smenasotr = await Smena_Sotr.findAll({
            order: [['date','desc']],
            where: {date:date},
            include: [{model: Users,
                attributes: {exclude: ['pass']},
            },{model: Smena}]
        }
        )
        return res.json({smenasotr: smenasotr,Cod:res.statusCode})
    }
    async del(req,res,next){
        const {id} = req.params;
        const candidate=await Smena_Sotr.findOne({where:{id_smena_sotr:id}})
        if(!candidate){
            return next(ApiError.badReq(`Назначение с id ${id}  не существует`))
        }
        candidate.destroy()
        res.json({message:`Назначение с id ${id} удален`})
    }


}

module.exports = new SmenaSotrController()
