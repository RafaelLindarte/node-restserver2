const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', verificaToken, (req, res) => {
    let initial = Number(req.query.desde) || 0;
    let limit = Number(req.query.limite) || 5;
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(initial)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                });
            });
        })

});


//POST-Generalmente se usa para crear registros 
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {


    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});
//PUT-Generalmente se usa para añadir o actualizar informacion  
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    /*
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if( !usuarioBorrado ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }  
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
    */
    let id = req.params.id;
    cambiarEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

module.exports = app