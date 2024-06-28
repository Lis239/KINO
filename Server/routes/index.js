var Router = require('express');
var router = new Router();
const userRouter =require('./userRouter')
const filmRouter =require('./filmRouter')
const zalRouter=require('./zalRouter')
const usersRouter=require('./usersRouter')
const smenaRouter=require('./smenaRouter')
const smenasotrRouter=require('./smenasotrRouter')
const seansRouter=require('./seansRouter')
const mainRouter=require('./mainRouter')
const bronRouter=require('./bronRouter')
const biletRouter=require('./biletRouter')
const statisticRouter=require('./statisticRouter')


router.use('/user',userRouter)
router.use('/film',filmRouter)
router.use('/zal',zalRouter)
router.use('/users',usersRouter)
router.use('/smena',smenaRouter)
router.use('/smenasotr',smenasotrRouter)
router.use('/seans',seansRouter)
router.use('/main',mainRouter)
router.use('/bron',bronRouter)
router.use('/bilet',biletRouter)
router.use('/statistic',statisticRouter)


module.exports=router