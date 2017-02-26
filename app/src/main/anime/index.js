import { ipcMain as ipc, dialog } from 'electron'
import fs from 'fs'

const walk = require('walk')
const async = require('async-q');
const Q     = require('q');

module.exports = function() {

  ipc.on('open-anime', function (e) {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function (files) {
      e.sender.send('selected-anime', files)
    })
  })

  ipc.on('scan-anime', function (e, anime) {

    if (fs.existsSync(anime.source)) {
      var items = [], totalTime = 0;

      let all = fs.readdirSync(anime.source).map((folder_name, index) => {
        let item = {
          index: index,
          verify: true,
          anilist: 0,
          name: folder_name,
          path: `${anime.source}\\${folder_name}`,
          files: [],
          anime: {}
        };

        return () => {
          let def = Q.defer(), walker = walk.walk(item.path, {}), time = Math.floor(Date.now());
          walker.on("file", function (root, file, next) {
            let ignore = [ 'Desktop.ini', 'AnimeImage.bmp' ]
            if (ignore.indexOf(file.name) == -1) {
              let list = {
                uid: file.uid,
                name: file.name,
                size: file.size,
                ctime: file.ctime
              }
              item.files.push(list)
            }
            next();
          });


          console.log(`Tasks-${item.name} Begin...`);
          walker.on("errors", function (root, nodeStatsArray, next) {
            console.log(`error-${root}`); 
            next();
          });

          walker.on("end", function () {
            let elapsed = Math.floor(Date.now()) - time;
            totalTime += elapsed;
            items.push(item);
            console.log(`Tasks-${item.name} Successful (${(elapsed/1000).toFixed(2)}s`); 
            def.resolve();
          });
          return def.promise;
        }
      })


      async.series(all).then(results => {
        console.log(`Total ${all.length} Tasks Successful (${(totalTime/1000).toFixed(2)}s)`); 
        e.sender.send('list-anime', { found: true, items: items });
      });
    } else {
      e.sender.send('list-anime', { found: false, items: [] });
    }

  })
}