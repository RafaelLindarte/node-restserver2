const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
let Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
app.use(fileUpload());

//actualiza imgen del usuario o producto
app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }
    //validacion de tipo de archivo
    let tiposvalidos = ['productos', 'usuarios'];
    if (tiposvalidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos permitidos son: ' + tiposvalidos
                }
            });
    }
    let archivo = req.files.archivo;
    let nombrecortado = archivo.name.split('.');
    let extension = nombrecortado[nombrecortado.length - 1];

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Las extensiones validas son ' + extensionesValidas,
                    ext: extension
                }
            });
    }
    //concatenación del nobre del archivo con el ID
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`; //esto es una solucion pero no se sabe que tan escalable es para produccion, con milles de usuarios
    //1.-se guarda la nueva imagen en el server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        //2.-se actualiza el nombre del archivo en la DB
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }


    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                })
        }

        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioActualizado) => {

            res.json({
                ok: true,
                usuario: usuarioActualizado,
                img: nombreArchivo
            })
        })
    });

}



function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                })
        }
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoActualizado) => {

            res.json({
                ok: true,
                producto: productoActualizado,
                img: nombreArchivo
            })
        })
    });

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;