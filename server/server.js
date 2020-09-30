require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
//parce application/jason
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//Configuracion global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', 3000);
});