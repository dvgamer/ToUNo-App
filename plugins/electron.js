import Vue from 'vue'
import { ipcRenderer } from 'electron'
let Electron = {}

Electron.install = function (Vue, options) {
  Vue.prototype.$ipc = {
    call: (name, sender) => new Promise((relove, reject) => {
      try {
        ipcRenderer.removeAllListeners(name)
        ipcRenderer.on(name, (e, data) => relove(data))
        ipcRenderer.send(name, sender)
      } catch (ex) {
        reject(ex)
      }
    }),
    send: (name, data) => ipcRenderer.send(name, data),
    on: (name, callback) => {
      ipcRenderer.removeAllListeners(name)
      ipcRenderer.on(name, (e, data) => callback(data))
    }
  }
}

Vue.use(Electron)
