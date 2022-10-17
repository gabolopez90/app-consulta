//Declara variables
const { BrowserWindow, app } = require('electron')
require('./app.js')

let mainWindow = null

function main() {
  //Nueva ventana
  mainWindow = new BrowserWindow({ autoHideMenuBar: true, backgroundColor: '#2E73C7' })
  //Maximizada
  mainWindow.maximize();
  mainWindow.loadURL(`http://localhost:8080/`);  
  mainWindow.on('close', event => {
    mainWindow = null
  });
}

//Cuando esté lista la página, la carga en la ventana
app.on('ready', main)