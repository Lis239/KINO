const Router = require('express');
const router = new Router();
const ZalController=require('../controllers/zalController');
const authMiddleware =require('../middleware/authMiddleware')
const CheckRole =require('../middleware/checkRoleMiddleware')

router.post('/', authMiddleware,CheckRole(['admin']),ZalController.create)
router.get('/', authMiddleware, ZalController.getAll)
router.get('/:id', authMiddleware, ZalController.getOne)
router.put('/:id', authMiddleware,CheckRole(['admin']), ZalController.update)

module.exports = router