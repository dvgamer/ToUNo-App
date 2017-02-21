import { ipcMain as ipc, dialog } from 'electron'
import fs from 'fs'

const walk = require('walk')

module.exports = function() {

  ipc.on('open-anime', function (e) {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function (files) {
      if (files) e.sender.send('selected-anime', files)
    })
  })

  ipc.on('scan-anime', function (e, anime) {
    if (fs.existsSync(anime.source)) {
      let items = fs.readdirSync(anime.source)
      let walker = walk.walk(anime.source, {});
      walker.on("file", function (root, file, next) {
        let item = {
          uid: file.uid,
          name: file.name,
          size: file.size,
          ctime: file.ctime
        }
        next();
      });

      walker.on("errors", function (root, nodeStatsArray, next) {
        next();
      });

      walker.on("end", function () {
        console.log("Anime Items:", anime.source)
        e.sender.send('list-anime', { found: true, items: items })
      });
    } else {
      e.sender.send('list-anime', { found: false, items: [] })
    }
  })
}