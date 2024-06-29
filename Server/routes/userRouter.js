const Router = require('express');
const router = new Router();
const UserController=require('../controllers/userController');
const {check}=require("express-validator")
const authMiddleware =require('../middleware/authMiddleware')
const useridMiddleware =require('../middleware/useridMiddleware')
const CheckRole =require('../middleware/checkRoleMiddleware')

router.post('/registration',[
    check('login',"Имя пользователя не может быть пустым").notEmpty(),
    check('pass',"Пароль должен быть не меньше 8 символов и не больше 20").isLength({min:8,max:20}),
], UserController.registr);
router.post('/login',UserController.login);
router.get('/auth',authMiddleware,UserController.chek);
router.put('/SUser/:id',authMiddleware,useridMiddleware,UserController.SUser);
router.get('/auth/:id',authMiddleware,useridMiddleware,UserController.UserOne);
router.delete('/auth/:id',CheckRole(['admin']),UserController.del);




module.exports=router