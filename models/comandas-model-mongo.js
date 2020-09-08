const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comandasSchema = new Schema({
    pedido: String,
    id_camarero: Number,
    hora_pedido: Date


});

module.exports = mongoose.model('Comanda', comandasSchema);