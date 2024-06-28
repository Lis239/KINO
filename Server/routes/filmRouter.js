const Router = require('express');
const router = new Router();
const FilmController = require('../controllers/filmController');
const authMiddleware =require('../middleware/authMiddleware');
const CheckRole =require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware,CheckRole(['admin']),FilmController.create)
router.get('/', FilmController.getAll)
router.get('/:id', FilmController.getOne)
router.put('/:id', authMiddleware,CheckRole(['admin']), FilmController.update)
router.delete('/info/:id', authMiddleware,CheckRole(['admin']), FilmController.del_info)

module.exports = router