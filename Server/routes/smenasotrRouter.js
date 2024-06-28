const Router = require('express');
const router = new Router();
const authMiddleware =require('../middleware/authMiddleware')
const CheckRole =require('../middleware/checkRoleMiddleware')
const SmenaSotrController = require('../controllers/smenasotrController')

router.post('/', authMiddleware,CheckRole(['admin']),SmenaSotrController.create)
router.get('/', authMiddleware,CheckRole(['admin','prod']),SmenaSotrController.getAll)
router.delete('/:id',authMiddleware,CheckRole(['admin']),SmenaSotrController.del);
module.exports = router