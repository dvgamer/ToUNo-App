import { ipcMain as ipc, dialog } from 'electron'

module.exports = function() {

  ipc.on('open-anime', function (e) {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function (files) {
      if (files) e.sender.send('selected-anime', files)
    })
  })

  ipc.on('scan-anime', function (e, data) {
  	console.log('scan-anime', data);
  })
}