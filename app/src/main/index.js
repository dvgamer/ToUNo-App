'use strict'

import { app, BrowserWindow, ipcMain as ipc, dialog } from 'electron'

require('./anime')()

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 950,
    minWidth: 950,
    minHeight: 600,
    height: 600,
    title: app.getName()
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })


  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
