const { app } = require('electron')
const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const http = require('http')

require('./server/anime/index.js')()

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
const _NUXT_URL_ = (process.argv || [])[3] || `http://localhost:3000`
config.dev = !((process.env.NODE_ENV || 'production') === 'production')
/*
** Electron app
*/
let win = null
let createdWindow = () => {
  if (win !== null) return
  win = new BrowserWindow(Object.assign({
    title: 'Electron App',
    width: 800,
    height: 600
  }, config.electron))
  win.setMenuBarVisibility(false)
  if (!config.dev) {
    return win.loadURL(_NUXT_URL_)
  } else {
    // Install vue dev tool and open chrome dev tools
    const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id).then(name => {
      console.log(`Added Extension:  ${name}`)
      win.webContents.openDevTools()
    }).catch(err => console.error('An error occurred: ', err))

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

  const POLL_INTERVAL = 1000
  const pollServer = () => {
    http.get(_NUXT_URL_, res => (res.statusCode !== 200) ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL(_NUXT_URL_)).on('error', pollServer)
  }
  setTimeout(pollServer, POLL_INTERVAL)
}

app.on('ready', createdWindow)
app.on('activate', createdWindow)
app.on('window-all-closed', () => app.quit())
