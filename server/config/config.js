//------------------
// Puerto
//------------------

process.env.PORT = process.env.PORT || 3000;
//------------------
// Entorno
//------------------
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//------------------
// Vencimiento del token
//------------------
process.env.TOKEN_TIMELIMIT = '48h';
//------------------
// SEED de authenticaciòn
//------------------
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'este-es-el-seed-desarrollo';
//------------------
// Base de datos
//------------------
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test';
} else {
    urlDB = process.env.MONGO_URI;

}
process.env.URLDB = urlDB;

//------------------
// Google Client ID
//------------------
process.env.CLIENT_ID = process.env.CLIENT_ID || '221706635344-ih2hkosc6btd010burpbga197f8ffv12.apps.googleusercontent.com'