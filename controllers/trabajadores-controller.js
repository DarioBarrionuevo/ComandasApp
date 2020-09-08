var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const trabajadoresModelMongo = require("../models/trabajadores-model-mongo");

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
    addTrabajador: async function (req, res) {

        const trabajadorInfo = req.body;
        // console.log("trabajadorInfo", trabajadorInfo)
        const trabajador1 = new trabajadoresModelMongo();

        trabajador1.nombre = trabajadorInfo.nombre;
        trabajador1.apellidos = trabajadorInfo.apellidos;
        trabajador1.puesto_trabajo = trabajadorInfo.puesto_trabajo;
        trabajador1.nombre_usuario = trabajadorInfo.nombre_usuario;

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(trabajadorInfo.password, salt);
        trabajador1.password = encryptedPassword;

        trabajador1.save((err, savedInfo) => {
            if (err) throw new Error("Error al añadir un trabajador", err);
            // console.log('Se ha insertado el trabajador', savedInfo);
            res.status(200).json({
                message: "Se ha añadido el trabajador",
                guestInfo: savedInfo,
            });
        });

    },

    userLogin: async function (req, res) {
        try {
            // console.log('REQBODY', req.body);
            const {
                nombre_usuario,
                password
            } = req.body;

            const userData = await trabajadoresModelMongo.find({
                nombre_usuario: req.body.nombre_usuario
            });
            // console.log("userData", userData)
            if (!userData) {
                res.status(401).json({
                    message: "Usuario o contraseña incorrectos",
                });
                return;
            }
            const passwordIsCorrect = await bcrypt.compare(
                password,
                userData[0].password

            );


            if (!passwordIsCorrect) {
                res.status(401).json({
                    message: "Usuario o contraseña incorrectos",
                });
                return;
            }
            const token = jwt.sign({
                    nombre_usuario,
                },
                process.env.SECRET, {
                    expiresIn: 60 * 60 * 24,
                }
            );
            res.status(200).json({
                message: "Login correcto",
                token,
                nombre_usuario,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send("Se ha producido un error");
        }
    },
    getCamareros: async function (req, res) {
        if (tipoBBDD) {
            const guestList = await trabajadoresModelMongo.find({
                puesto_trabajo: "camarero",
            });
            // console.log("guestList", guestList);
            res.status(200).json({
                ...guestList,
            });
        } else {
            const getCamareros = await comandasModel.getCamareros();
            // console.log('CONTROLLER', getCamareros);
            res.send(getCamareros);
        }
    },
    getTrabajadores: async function (req, res) {
        if (tipoBBDD) {
            const guestList = await trabajadoresModelMongo.find();
            // console.log("guestList", guestList);
            res.status(200).json({
                ...guestList,
            });
        } else {
            try {
                const getTrabajadores = await comandasModel.getTrabajadores();
                // console.log('CONTROLLER', getTrabajadores);
                res.send(getTrabajadores);
            } catch (error) {
                console.log(error);
                res.send("Se ha producido un error");
            }
        }
    },
    updateTrabajador: async function (req, res) {
        if (tipoBBDD) {
            const {
                nombre,
                apellidos,
                puesto_trabajo,
                nombre_usuario,
                password,
            } = req.body;
            const oneTrabajador = await trabajadoresModelMongo.findByIdAndUpdate(
                req.params.id, {
                    nombre,
                    apellidos,
                    puesto_trabajo,
                    nombre_usuario,
                    password,
                }
            );
            // console.log(oneTrabajador);
            res.status(200).json({
                message: "Se ha actualizado el trabajador",
                guestInfo: req.body,
            });
        } else {
            try {
                const itemToUpdate = req.params.id;
                const trabajador = await comandasModel.updateTrabajador(
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
}