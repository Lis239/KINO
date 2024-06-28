const Router = require('express');
const router = new Router();
const authMiddleware =require('../middleware/authMiddleware')
const CheckRole =require('../middleware/checkRoleMiddleware')
const SmenaController = require('../controllers/smenaController')


router.post('/', authMiddleware,CheckRole(['admin']),SmenaController.create)
router.get('/', authMiddleware, SmenaController.getAll)
router.get('/:id', authMiddleware, SmenaController.getOne)
router.put('/:id', authMiddleware,CheckRole(['admin']), SmenaController.update)
router.delete('/:id',CheckRole(['admin']),SmenaController.del);

module.exports = router