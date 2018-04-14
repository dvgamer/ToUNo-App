const { app } = require('electron')
const { createdWindow } = require('./server')

app.on('ready', createdWindow)
app.on('activate', createdWindow)
app.on('window-all-closed', () => app.quit())
