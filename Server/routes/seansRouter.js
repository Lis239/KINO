const Router = require('express');
const router = new Router();
const SeanssController = require('../controllers/seansController')
const authMiddleware =require('../middleware/authMiddleware')
const CheckRole =require('../middleware/checkRoleMiddleware')



router.post('/', authMiddleware,CheckRole(['admin']),SeanssController.create)
router.get('/', SeanssController.getAll)
router.get('/:id', SeanssController.getOne)
router.put('/:id', authMiddleware,CheckRole(['admin']), SeanssController.update)
router.delete('/:id', authMiddleware,CheckRole(['admin']), SeanssController.del)


module.exports = router