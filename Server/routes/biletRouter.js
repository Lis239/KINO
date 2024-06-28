const Router = require('express');
const router = new Router();
const BiletController = require('../controllers/biletController');
const authMiddleware =require('../middleware/authMiddleware');

router.post('/', authMiddleware,BiletController.create)
router.get('/seansmesta',BiletController.seansmesta)
router.get('/mymesta',authMiddleware,BiletController.mymesta)
router.get('/bilets',authMiddleware,BiletController.getAll)

module.exports = router