const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Users =sequelize.define('Users',{
    user_id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    login:{type:DataTypes.STRING(100),unique:true},
    pass:{type:DataTypes.STRING(100)},
    rol:{type:DataTypes.STRING(20),defaultValue:"user"},
    LName:{type:DataTypes.STRING(50)},
    FName:{type:DataTypes.STRING(50)},
    MName:{type:DataTypes.STRING(50)},
    Email:{type:DataTypes.STRING(50)},
})

const Film = sequelize.define('film', {
    id_film: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    date: {type: DataTypes.STRING,  allowNull: false},
    autor: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
})

const FilmInfo = sequelize.define('film_info', {
    id_info: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    coment: {type: DataTypes.STRING, allowNull: false},
})


const Zal = sequelize.define('Zal', {
    id_zal: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    mesta_count: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
})


const Smena = sequelize.define('smena', {
    id_smena: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    info: {type: DataTypes.STRING, allowNull: false},
})

const Smena_Sotr = sequelize.define('smena_sotr', {
    id_smena_sotr: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATEONLY, allowNull: false},
})


const Seans= sequelize.define('seans', {
    id_seans: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATEONLY, allowNull: false},
    time_start: {type: DataTypes.TIME, allowNull: false},
    duration: {type: DataTypes.TIME, allowNull: false},
    time_end: {type: DataTypes.TIME, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    Vis:{type: DataTypes.BOOLEAN, allowNull: false,defaultValue:true},
})

const Bron= sequelize.define('bron', {
    id_bron:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    kod:{type:DataTypes.STRING(20)},
    sposob:{type:DataTypes.STRING(20)},
    type_creater:{type:DataTypes.STRING(20)},
    date_create:{type: DataTypes.DATE, allowNull: false},
    date_end:{type: DataTypes.DATE, allowNull: false},
    status:{type:DataTypes.STRING(20)},
    time: {type: DataTypes.TIME, allowNull: false},
    mesto: {type: DataTypes.INTEGER, allowNull: false},
    sum:{type: DataTypes.INTEGER, allowNull: false},
})
const Bilet= sequelize.define('bilet', {
    id_bilet:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sposob:{type:DataTypes.STRING(20)},
    type_creater:{type:DataTypes.STRING(20)},
    date_create:{type: DataTypes.DATE, allowNull: false},
    time: {type: DataTypes.TIME, allowNull: false},
    mesto: {type: DataTypes.INTEGER, allowNull: false},
    sum:{type: DataTypes.INTEGER, allowNull: false},
})


Film.hasMany(FilmInfo, {as: 'info'});
FilmInfo.belongsTo(Film)

Smena.hasMany(Smena_Sotr);
Smena_Sotr.belongsTo(Smena)

Users.hasMany(Smena_Sotr);
Smena_Sotr.belongsTo(Users)

Zal.hasMany(Seans);
Seans.belongsTo(Zal)

Film.hasMany(Seans);
Seans.belongsTo(Film)

Users.hasMany(Bron);
Bron.belongsTo(Users)

Seans.hasMany(Bron);
Bron.belongsTo(Seans)

Users.hasMany(Bilet);
Bilet.belongsTo(Users)

Seans.hasMany(Bilet);
Bilet.belongsTo(Seans)



module.exports={
    Users,
    Film,
    FilmInfo,
    Zal,
    Smena,
    Smena_Sotr,
    Seans,
    Bilet,
    Bron,
}