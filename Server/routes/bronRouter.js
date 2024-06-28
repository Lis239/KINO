const Router = require('express');
const router = new Router();
const BronController = require('../controllers/bronController');
const authMiddleware =require('../middleware/authMiddleware');


router.post('/', authMiddleware,BronController.create)
router.get('/limit', authMiddleware,BronController.getlimit)
router.get('/brons',authMiddleware,BronController.getAll)
router.put('/:id', authMiddleware, BronController.updateBron)
router.put('/buy/:id', authMiddleware, BronController.buyBron)

module.exports = router