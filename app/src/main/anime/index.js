import { ipcMain as ipc, dialog } from 'electron'
import { spawn } from 'child_process'
import fs from 'fs'
import ini from 'ini'
import walk from 'walk'
import async from 'async-q'
import Q from 'q'

const attrib = anime => {
  let def = Q.defer(), error = false;
  const ls = spawn('C:/Windows/System32/attrib.exe', anime);
  ls.stderr.on('data', data => error = true);
  ls.on('close', (code) => {
    if(code == 0 && !error) { def.resolve(code); } else { def.reject(code); }
  });
  return def.promise;
}

const desktop = anime => {
  let def = Q.defer();
  let iniDesktop = ini.stringify({
    'ShellClassInfo': {
      ConfirmFileOp: 0,
      NoSharing: 1,
      IconFile: 'AnimeImage.bmp',
      IconIndex: 0,
      InfoTip: anime.name
    },
    'ToUNo-Anime': {
      id: anime.id
    }
  });

  if (fs.existsSync(anime.path)) {

  } else {
    fs.writeFile(`${anime.path}/Desktop.ini`, new Buffer(iniDesktop), function (err) {
      if(err) def.resolve(); else def.reject();
    });
  }



  return def.promise;
}


module.exports = function() {
  ipc.on('save-anime', function(e, Items){
    console.log(Items)
    // if (fs.existsSync(anime.path)) {

      // console.log(`${anime.path}/Desktop.ini`)
      // fs.writeFile(`${anime.path}/Desktop.ini`, new Buffer(iniDesktop.replace('[\.S','[.S')), function (err) {
      //   if (!err) {
      //     attrib([ '+s', '+h', `"${path}\\Desktop.ini"` ]).then(() => {
      //    e.sender.send('saved-anime', { action: 'success', index: anime.index })
      //     }).catch(() => {
      //       e.sender.send('saved-anime', { action: 'fail', index: anime.index })
      //     })
      //   } else {
      //     console.log('saved', err);
      //     e.sender.send('saved-anime', { action: 'fail', index: anime.index })
      //   }
      // });
    // } else {
      e.sender.send('saved-anime', { action: 'fail', index: anime.index })
    // }
  })

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