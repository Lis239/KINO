const {validationResult}  =require("express-validator") ;
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');
const {Users} =require('../models/models')
const ApiError =require('../error/ApiError')
const {isEmpty} = require("../globalfunc/global");
const { Op } = require('sequelize')


const GJwt=(id,login,rol)=>{
    return jwt.sign({id,login,rol},process.env.SK_SK,{expiresIn: '24h'})
}
class UserController {
    async registr(req,res,next){
        const {login,pass,rol,lname,fname,mname,email}=req.body
        const errors=validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array())
            return  next(ApiError.badReq({errors}))
        }
        const candidate=await  Users.findOne({where:{login}})
        if(candidate){
            return next(ApiError.badReq(`Полььзователь с логином ${login}  уже существует`))
        }
        const hashPass=await bcrypt.hash(pass,5)
        const user =await Users.create({login,pass:hashPass,rol,LName:lname,FName:fname,MName:mname,Email:email})
        const token =GJwt(user.user_id,user.login,user.rol)
        return res.json({token,Cod:res.statusCode})
    }
    async login(req,res,next){
        const {login,pass}=req.body
        const user=await  Users.findOne({where:{login}})
        if (!user){
            return  next(ApiError.badReq(`Пользователь с логином ${login}  не найден`))
        }
        let comppass=bcrypt.compareSync(pass,user.pass)
        if (!comppass){
            return  next(ApiError.badReq(`Пользователь ${login} ввел неверный пароль`))
        }
        const token =GJwt(user.user_id,user.login,user.rol)
        return res.json({token})
    }
    async chek(req,res,next){
        const token =GJwt(req.user.id,req.user.login,req.user.rol)
        return res.json({token:token,Cod:res.statusCode})
    }
    async del(req,res,next){
        const {id} = req.params;
        const candidate=await Users.findOne({where:{user_id:id}})
        if(!candidate){
            return next(ApiError.badReq(`Подьзователь с id ${id}  не существует`))
        }
        candidate.destroy()
        res.json({message:`Подьзователь с id ${id} удален`})
    }
    async SUser(req,res,next){
        const {id} = req.params
        let user_id = id
        let {login,pass,newpass,lname,fname,mname,email} = req.body
        const candidate=await  Users.findOne({where:{login, user_id:{[Op.not]:[user_id]}}})
        if(candidate){
            return next(ApiError.badReq(`Полььзователь с логином ${login}  уже существует`))
        }
        const candidate2=await  Users.findOne({where:{user_id}})
        const VerPass=await bcrypt.compare(pass,candidate2.pass)
        if(!(VerPass)&(isEmpty(pass)&isEmpty(newpass))){
            return next(ApiError.badReq(`Старый парьль не верный`))
        }
        let user;
        if(VerPass&(isEmpty(pass)&isEmpty(newpass))){
            const hashPass=await bcrypt.hash(newpass,5)
            user=candidate2.update({login:login,pass:hashPass, LName:lname,MName:mname, FName:fname,Email: email})
        }else
        if(!(pass&newpass)){
            user=candidate2.update({login:login, LName:lname,MName:mname, FName:fname,Email: email})
        }
        return res.json({user:user,Cod:res.statusCode})
    }

    async SUser_Role(req,res,next){
        const {id} = req.params
        let user_id = id
        let {login,pass,rol,lname,fname,mname,email} = req.body
        const candidate=await  Users.findOne({where:{login, user_id:{[Op.not]:[user_id]}}})
        if(candidate){
            return next(ApiError.badReq(`Полььзователь с логином ${login}  уже существует`))
        }
        const candidate2=await  Users.findOne({where:{user_id}})
        let user;
        if(isEmpty(pass)){
            const hashPass=await bcrypt.hash(pass,5)
            user=candidate2.update({login:login,pass:hashPass, LName:lname,MName:mname,rol:rol, FName:fname,Email: email})
        }
        if(!isEmpty(pass)){
            user=candidate2.update({login:login, LName:lname,MName:mname, FName:fname,rol:rol,Email: email})
        }
        return res.json({user:user,Cod:res.statusCode})
    }

    async UserOne(req,res,next){
        const {id} = req.params
        let user_id=id
        const user=await  Users.findOne({where:{user_id},attributes: {exclude: ['pass']}})
        return res.json({user: user,Cod:res.statusCode})
    }

    async getAll(req, res) {
        let {limit,rol, page,searchtext} = req.query

        let users;
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        if (!searchtext&!rol){
            users = await Users.findAndCountAll({limit, offset,order: [['login','desc']],attributes: {exclude: ['pass']}})
        }

        if (searchtext&!rol){
            users = await Users.findAndCountAll({
                limit,
                offset,
                order: [['login','desc']],
                attributes: {exclude: ['pass']},
                where: {login:{[Op.iLike]:`%`+searchtext.trim().toLowerCase()+`%`}}}
            )
        }
        if(rol){
            users = await Users.findAll({
                order: [['login','desc']],
                attributes: {exclude: ['pass']},
                where: {rol:rol}
            })
        }

        return res.json({users: users,Cod:res.statusCode})
    }

}

module.exports=new UserController()