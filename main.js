const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const http = require('http')

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
const _NUXT_URL_ = (process.argv || [])[3] || `http://localhost:3000`
config.dev = !((process.env.NODE_ENV || 'production') === 'production')
/*
** Electron app
*/
const POLL_INTERVAL = 1000
const pollServer = () => {
  http.get(_NUXT_URL_, res => {
    const SERVER_DOWN = res.statusCode !== 200
    SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL(_NUXT_URL_)
  })
  .on('error', pollServer)
}

let win = null // Current window
const newWin = () => {
  console.log('configuration electron')
  console.log(Object.assign({
    title: 'Electron App',
    width: 800,
    height: 600
  }, config.electron))
  win = new BrowserWindow(Object.assign({
    title: 'Electron App',
    width: 800,
    height: 600
  }, config.electron))
  win.setMenuBarVisibility(false)
  if (!config.dev) {
    return win.loadURL(_NUXT_URL_)
  } else {
    win.webContents.openDevTools()
    win.webContents.on('devtools-opened', () => {
      setImmediate(() => win.focus())
    })
  }
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', () => win = null)






  setTimeout(pollServer, POLL_INTERVAL)
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())

