const Router = require('express');
const router = new Router();
const authMiddleware =require('../middleware/authMiddleware');
const StatController = require('../controllers/statisticController');

router.get('/', authMiddleware,StatController.getAll)

module.exports = router