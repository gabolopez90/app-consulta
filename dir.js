const { app } = require('electron')
//Obtiene la direccion del escritorio del equipo
var direccion = app.getPath('desktop');
//Exporta la dirección para ser usada por app.js
module.exports = direccion;