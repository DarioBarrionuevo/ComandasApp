const express = require('express');
const trabajadoresController = require('../controllers/trabajadores-controller');

const router = express.Router();

router.post('/login', trabajadoresController.userLogin);
router.post('/addTrabajador', trabajadoresController.addTrabajador);

// GET data
router.get('/verCamareros', trabajadoresController.getCamareros);
router.get('/verTrabajadores', trabajadoresController.getTrabajadores);

//UPDATE data
router.put('/actualizarTrabajador/:id', trabajadoresController.updateTrabajador);

module.exports = router;