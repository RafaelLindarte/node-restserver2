const express = require('express');
let app = express();
let Producto = require('../models/producto');
let { verificaToken } = require('../middlewares/autenticacion');
const producto = require('../models/producto');



app.get('/productos', verificaToken, (req, res) => {
    let initial = Number(req.query.desde) || 0;
    let limit = Number(req.query.limite) || 5;
    Producto.find({ disponible: true })
        .skip(initial)
        .limit(limit)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        })

});


app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }
            res.json({
                ok: true,
                Producto: productoDB
            });
        })
});


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regularExpresion = new RegExp(termino, 'i');
    Producto.find({ nombre: regularExpresion })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }
            res.json({
                ok: true,
                productos
            });
        })
});

app.post('/productos', verificaToken, function(req, res) {


    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(201).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });


});
//PUT-Generalmente se usa para añadir o actualizar informacion  
app.put('/productos/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }
        productoDB.nombre = body.nombre,
            productoDB.precioUni = body.precioUni,
            productoDB.descripcion = body.descripcion,
            productoDB.disponible = body.disponible,
            productoDB.categoria = body.categoria

        productoDB.save((err, productoActualizado) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoActualizado
            })
        });
    });

});

app.delete('/productos/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    cambiarDisponibilidad = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiarDisponibilidad, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto no disponible'
        });
    })


});
module.exports = app