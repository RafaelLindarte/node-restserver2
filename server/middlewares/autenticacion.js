const jwt = require('jsonwebtoken');
//-----------------
//verificar token
//------------------

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //obtener header 'token'

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

//-----------------
//verificar admin-role
//------------------

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        res.json({
            ok: false,
            err: {
                message: 'Usuario no es administrador'
            }
        });
    }



};

//-----------------
//verificar token
//------------------

let verificaTokenURL = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenURL
};