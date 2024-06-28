const ApiError =require('../error/ApiError')
const uuid = require('uuid')
const path = require('path');
const {Zal} =require('../models/models')


class ZalController {
    async getOne(req, res,next) {
        try {
            const {id} = req.params
            let id_zal = id
            const zal = await Zal.findOne(
                {
                    where: {id_zal}
                },
            )
            if (zal===null){
                return  next(ApiError.badReq('Зал отсутствует'))
            }
            return res.json({zal: zal, Cod: res.statusCode})
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async create(req, res, next) {
        try {
            let {name,mesta_count} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static_zal', fileName))
            const zal = await Zal.create({name,mesta_count,img: fileName});
            return res.json({zal:zal,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }

    async getAll(req, res) {

        let {searchtext} = req.query
        let zal;
        if (!searchtext){
            zal = await Zal.findAndCountAll({order: [['name','desc']]})
        }
        if (searchtext){
            zal = await Zal.findAndCountAll({
                order: [['name','desc']],
                where: {name:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}}}
            )
        }
        return res.json({zal: zal,Cod:res.statusCode})
    }


    async update(req, res, next) {
        try {
            const {id} = req.params
            let id_zal = id
            let fileName=''
            let {name,mesta_count} = req.body
            if(req?.files){
                const {img} = req.files
                fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static_zal', fileName))
            }
            const zal=await Zal.findOne({
                where:{id_zal:id_zal},
            }).then(zal=>{
                    if (req.files){zal.update({name:name,mesta_count:mesta_count,img: fileName},  {where:{id_zal:id_zal}})}
                    else {zal.update({name:name,mesta_count:mesta_count},  {where:{id_zal:id_zal}})}
                }
            )
            return res.json({zal:zal,Cod:res.statusCode})
        } catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
}

module.exports = new ZalController()