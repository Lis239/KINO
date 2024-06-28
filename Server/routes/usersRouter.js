const Router = require('express');
const router = new Router();
const UserController=require('../controllers/userController');
const authMiddleware =require('../middleware/authMiddleware')
const CheckRole =require('../middleware/checkRoleMiddleware')

router.get('/',authMiddleware,CheckRole(['admin','prod']),UserController.getAll);
router.get('/:id',authMiddleware,CheckRole(['admin','prod']),UserController.UserOne);
router.put('/:id',authMiddleware,CheckRole(['admin']),UserController.SUser_Role);



module.exports=router