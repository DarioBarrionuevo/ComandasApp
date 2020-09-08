const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const comandasModelMongo = require("../models/comandas-model-mongo");

const comandasModel = require("../models/comandas-model");

const tipoBBDD = process.env.DDBB_TYPE === "mongo" ? true : false;

if (tipoBBDD) {
  // console.log("DDBB_TYPE", tipoBBDD)
  mongoose.connect("mongodb://localhost:27017/comandas_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {

  getComandas: async function (req, res) {
    if (tipoBBDD) {
      const guestList = await comandasModelMongo.find();
      // console.log("guestList", guestList)
      res.status(200).json({
        ...guestList,
      });
    } else {
      const getComandas = await comandasModel.getComandas();
      // console.log('CONTROLLER', getComandas);
      res.send(getComandas);
    }
  },
  addComanda: async function (req, res) {
    if (tipoBBDD) {
      const comandaInfo = req.body;
      const comanda1 = new comandasModelMongo();

      comanda1.pedido = comandaInfo.pedido;
      comanda1.id_camarero = comandaInfo.id_camarero;
      comanda1.hora_pedido = comandaInfo.hora_pedido;

      comanda1.save((err, savedInfo) => {
        if (err) throw new Error("Error al añadir una comanda", err);
        // console.log('Se ha insertado la comanda', savedInfo);
        res.status(200).json({
          message: "Se ha añadido la comanda",
          guestInfo: savedInfo,
        });
      });
    } else {
      try {
        let camareroCorrecto = false;
        const getCamareros = await comandasModel.getCamareros();
        let camareroId = req.body.id_camarero;
        for (const camarero of getCamareros) {
          if (camarero.id === Number(camareroId)) {
            camareroCorrecto = true;
          }
        }
        if (!camareroCorrecto) {
          res.send("El camarero no es correcto");
        } else {
          const addComanda = await comandasModel.addComanda(req.body);
          res.send("Se ha insertado correctamente");
        }

        // Front hace petición addComanda -> Back guarda comanda y devuelve el ID con el que la ha guardado -> Front recibe ID (confirmación de que todo hay ido guay) y pinta la nueva comanda (con ese ID)
        // Front hace petición addComanda -> Back guarda comanda y no devuelve nada (sólo un 200 OK) -> Front hace un fetch de todas las comandas de nuevo y actualiza listado
      } catch (error) {
        console.log(error);
        res.send("Se ha producido un error");
      }
    }
  },
  deleteComanda: async function (req, res) {
    if (tipoBBDD) {
      const id = req.params.id;
      console.log("id", id);

      const comandaBorrada = await comandasModelMongo.deleteOne({
        _id: ObjectId(id),
      });
      console.log("comandaBorrada", comandaBorrada);
      res.status(200).json({
        comandaBorrada,
      });
    } else {
      try {
        const itemToDelete = req.params.id;
        const deleteComanda = await comandasModel.deleteComanda(itemToDelete);
        // console.log('CONTROLLER', deleteComanda);

        res.send("Comanda borrada!");
      } catch (error) {
        console.log(error);
        res.send("Se ha producido un error");
      }
    }
  },
  updateComanda: async function (req, res) {
    if (tipoBBDD) {
      const {
        pedido,
        id_camarero
      } = req.body;
      const oneComanda = await comandasModelMongo.findByIdAndUpdate(
        req.params.id, {
          pedido,
          id_camarero,
        }
      );
      // console.log(oneGuest);
      res.status(200).json({
        message: "Se ha actualizado la comanda",
        guestInfo: req.body,
      });
    } else {
      try {
        const itemToUpdate = req.params.id;
        const comanda = await comandasModel.updateComanda(
          req.body,
          itemToUpdate
        );
        res.send("Se ha actualizado correctamente");
      } catch (error) {
        console.log(error);
        res.send("Se ha producido un error");
      }
    }
  },

};