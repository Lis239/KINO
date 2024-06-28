const ApiError =require('../error/ApiError')
const { Op,QueryTypes } = require("sequelize");
const {Bron,Bilet} =require('../models/models');

class StatController {
    async getAll(req, res,next) {

        try {
            let {date_start, date_end} = req.query
            let colbronD=0;
            let colbronP=0;
            let colbilall=0;
            let colbilsite=0;
            let colbilkass=0;
            let sumbilall=0;
            let sumbilsite=0;
            let sumbilkass=0;
            let filmsum=0;


            colbronD =await Bron.sequelize.query(
                "SELECT COUNT(*) FROM public.brons where status='Действует' and date_end>='"+date_start+"' and date_end<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );

            colbronP =await Bron.sequelize.query(
                "SELECT COUNT(*) FROM public.brons where status='Подтвержден' and date_end>='"+date_start+"' and date_end<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );

            colbilall =await Bilet.sequelize.query(
                "SELECT COUNT(*) FROM public.bilets where  date_create>='"+date_start+"' and date_create<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );


            colbilsite =await Bilet.sequelize.query(
                "SELECT COUNT(*) FROM public.bilets where sposob='На сайте' and  date_create>='"+date_start+"' and date_create<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );


            colbilkass =await Bilet.sequelize.query(
                "SELECT COUNT(*) FROM public.bilets where sposob<>'На сайте' and  date_create>='"+date_start+"' and date_create<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );



            sumbilall =await Bilet.sequelize.query(
                "SELECT SUM(sum) FROM public.bilets where  date_create>='"+date_start+"' and date_create<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );


            sumbilsite =await Bilet.sequelize.query(
                "SELECT SUM(sum) FROM public.bilets where sposob='На сайте' and  date_create>='"+date_start+"' and date_create<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );


            sumbilkass =await Bilet.sequelize.query(
                "SELECT SUM(sum) FROM public.bilets where sposob<>'На сайте' and  date_create>='"+date_start+"' and date_create<='"+date_end+"';" ,
                {
                    type: QueryTypes.SELECT
                }
            );


            filmsum =await Bilet.sequelize.query(
                "SELECT  Sum(\"bilet\".\"sum\"), \"sean->film\".\"name\" AS \"sean.film.name\"\n" +
                "\tFROM \"bilets\" AS \"bilet\" LEFT OUTER JOIN \"seans\" AS \"sean\" ON \"bilet\".\"seanIdSeans\" = \"sean\".\"id_seans\" LEFT OUTER JOIN\n" +
                "\"Zals\" AS \"sean->Zal\" ON \"sean\".\"ZalIdZal\" = \"sean->Zal\".\"id_zal\" LEFT OUTER JOIN \"films\" AS \"sean->film\" ON \"sean\".\"filmIdFilm\" = \"sean->film\".\"id_film\" LEFT OUTER JOIN \"Users\" AS \"User\" ON \"bilet\".\"UserUserId\" = \"User\".\"user_id\" \n where date_create>='"+date_start+"' and date_create<='"+date_end+"' Group By \"sean->film\".\"name\" ORDER BY \"sum\" DESC  limit 3 offset 0;" ,
                {
                    type: QueryTypes.SELECT
                }
            );

            console.log(sumbilkass)

            return res.json({
                colbronD: colbronD[0].count,
                colbronP: colbronP[0].count,
                colbilall:colbilall[0].count,
                colbilsite:colbilsite[0].count,
                colbilkass:colbilkass[0].count,
                sumbilall:sumbilall[0].sum,
                sumbilsite:sumbilsite[0].sum,
                sumbilkass:sumbilkass[0].sum,
                filmsum:filmsum,
                Cod: res.statusCode})
        }catch (e) {
            return next(ApiError.badReq(e.message))
        }
    }
}

module.exports = new StatController()

