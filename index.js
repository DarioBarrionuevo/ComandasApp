require('dotenv').config();
const express = require('express');
const comandasRouter = require('./routes/comandas-route');
const trabajadoresRouter = require('./routes/trabajadores-route');
const cors = require("cors");
const autenticador = require("./controllers/autenticador");

const app = express();

app.set('port', 3000);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Routes

app.use('/trabajadores', trabajadoresRouter);

app.use('/comandas', autenticador, comandasRouter);
// Run app
app.listen(app.get('port'), () => console.log('Running on ', app.get('port')));