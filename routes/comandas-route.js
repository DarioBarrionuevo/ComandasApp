const express = require('express');
const comandasController = require('../controllers/comandas-controller');
const router = express.Router();

// ROUTES
// GET data
router.get('/verComandas', comandasController.getComandas);

// POST data
router.post('/addComanda', comandasController.addComanda);

// DELETE data
router.delete('/borrarComanda/:id', comandasController.deleteComanda);

//UPDATE data
router.put('/actualizarComanda/:id', comandasController.updateComanda);


module.exports = router;