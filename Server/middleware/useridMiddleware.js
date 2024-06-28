const jwt =require('jsonwebtoken')

module.exports=function (req,res,next) {
    if(req.method==="OPTIONS"){
        next()
    }
    try
    {
        const token =req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(401).json({message:"Пользователь не авторизован"})
        }
        const decoded=jwt.verify(token,process.env.SK_SK)
        const {id}=decoded
        const id_req = req.params.id
        if(!(id==id_req)){
            return res.status(401).json({message:"Доступ запрещен"})
        }
        next()
    }
    catch (e) {
        return res.status(401).json({message:"Права доступа отсутствуют"})
    }
}