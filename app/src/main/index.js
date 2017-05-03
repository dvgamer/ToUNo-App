'use strict'

import { app, BrowserWindow } from 'electron'
import path from 'path'

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
    width: 992,
    minWidth: 900,
    minHeight: 600,
    height: 640,
    'node-integration': false,
    title: app.getName(),
    icon: path.join(__dirname, 'app/icons/touno.ico')
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
