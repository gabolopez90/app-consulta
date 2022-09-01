const { app } = require('electron')

var direccion = app.getPath('desktop');

module.exports = direccion;