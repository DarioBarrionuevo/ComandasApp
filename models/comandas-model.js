const SQL = require("sql-template-strings");
const utils = require("../utils/index");

const comandasModel = {
  getCamareros: async function () {
    const query = SQL `SELECT * FROM trabajadores
            WHERE puesto_trabajo = 'camarero';`;

    return await utils.executeQuery(query);
  },
  getTrabajadores: async function () {
    const query = SQL `SELECT * FROM trabajadores;`;

    return await utils.executeQuery(query);
  },
  getComandas: async function () {
    const query = SQL `SELECT * FROM comandas;`;
    return await utils.executeQuery(query);
  },
  addComanda: async function (comanda) {
    // fecha actual sería: NOW() en vez del valor dinamico
    // console.log('comanda en model', comanda);
    const query = SQL `INSERT INTO comandas (pedido,id_camarero,hora_pedido)
        VALUES(${comanda.pedido}, ${comanda.id_camarero}, NOW());
        `;
    return await utils.executeQuery(query);
  },
  addTrabajador: async function (trabajador) {
    // console.log('comanda en model', trabajador);
    const query = SQL `INSERT INTO trabajadores (nombre,apellidos,puesto_trabajo,nombre_usuario,password)
        VALUES (${trabajador.nombre},${trabajador.apellidos},
        ${trabajador.puesto_trabajo},${trabajador.nombre_usuario},${trabajador.password});
        `;
    return await utils.executeQuery(query);
  },
  deleteComanda: async function (id) {
    // console.log('delete comanda por id en model', id);
    const query = SQL `DELETE FROM comandas
        WHERE id = ${id};`;
    return await utils.executeQuery(query);
  },
  deleteTrabajador: async function (id) {
    // console.log('delete comanda por id en model', id);
    const query = SQL `DELETE FROM trabajadores
        WHERE id = ${id};`;
    return await utils.executeQuery(query);
  },
  updateComanda: async function (comanda, id) {
    const query = SQL `UPDATE comandas
        SET pedido = ${comanda.pedido},
        id_camarero = ${comanda.id_camarero},
        hora_pedido = NOW()
        WHERE id = ${id};`;
    return await utils.executeQuery(query);
  },
  updateTrabajador: async function (trabajador, id) {
    const query = SQL `UPDATE trabajadores
        SET nombre =${trabajador.nombre},
        apellidos= ${trabajador.apellidos},
        puesto_trabajo= ${trabajador.puesto_trabajo}
        WHERE id =${id};`;
    return await utils.executeQuery(query);
  },

  // ----------------------------------------------------------------
};

module.exports = comandasModel;