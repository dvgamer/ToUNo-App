module.exports = {
  electron: {
    title: 'aniStorage™',
    width: 1024,
    height: 580,
    // minWidth: 1024,
    // minHeight: 580,
    // maxWidth: 600,
    // maxHeight: 360,
    'node-integration': false,
    icon: 'static/tree-bag.ico',
    show: true,
    movable: true,
    resizable: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    transparent: false, 
    frame: true
  },
  css: [
    'styles/index.scss'
  ],
  plugins: [
    'plugins/fortawesome.js'
  ],
  build: {
    extend (config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.target = 'electron-renderer'
      }
    }
  }
}
