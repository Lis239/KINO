const Router = require('express');
const router = new Router();
const MainController = require('../controllers/mainController');

router.get('/',MainController.All)
router.get('/:id/:date',MainController.getOne)


module.exports = router