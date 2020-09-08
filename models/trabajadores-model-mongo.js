const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const trabajadoresSchema = new Schema({
    nombre: String,
    apellidos: String,
    puesto_trabajo: String,
    nombre_usuario: String,
    password: String

});
module.exports = mongoose.model('Trabajadores', trabajadoresSchema);