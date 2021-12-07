const { BrowserWindow, app } = require('electron')
require('./app.js')

let mainWindow = null

function main() {
  mainWindow = new BrowserWindow({ width: 1100, height: 1050, autoHideMenuBar: true })
  mainWindow.loadURL(`http://localhost:8080/`)
  mainWindow.on('close', event => {
    mainWindow = null
  })
}

app.on('ready', main)