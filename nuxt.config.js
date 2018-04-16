module.exports = {
  mode: 'spa',
  loading: false,
  electron: {
    title: 'aniStorage™',
    width: 1024,
    height: 720,
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
    '@/styles/index.scss'
  ],
  plugins: [
    'plugins/bootstrap.js',
    'plugins/electron.js',
    'plugins/fortawesome.js'
  ],
  modules: [
    // With options
    '@nuxtjs/localforage',
    '@nuxtjs/moment'
  ],
  dev: process.env.NODE_ENV === 'DEV',
  build: {
    extend (config, { isClient, isDev }) {
      if (isDev && isClient) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Extend only webpack config for client-bundle
      if (isClient) { config.target = 'electron-renderer' }
    }
  }
}
