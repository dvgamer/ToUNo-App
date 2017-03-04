import { ipcMain as ipc, dialog } from 'electron'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import ini from 'ini'
import walk from 'walk'
import async from 'async-q'
import Q from 'q'


let getFile = folder => {
  return {
    desktop: `${folder}\\Desktop.ini`,
    image: `${folder}\\ANIME.jpg`,
  }
}

const exec = (cmd, arg) => {
  let def = Q.defer(), error = false;
  const ls = spawn(cmd, arg);
  ls.stderr.on('data', data => error = true);
  ls.on('close', (code) => {
    if(code == 0 && !error) { def.resolve(true); } else { def.reject(false); }
  });
  return def.promise;
}

const attrib = (arg, file) => {
  return exec('C:/Windows/System32/attrib.exe', [ `${arg}s`, `${arg}h`, file ]);
}

const desktop = anime => {
  let file = getFile(anime.path)
  let iniDesktop = {
    '.ShellClassInfo': {
      ConfirmFileOp: 0,
      NoSharing: 1,
      IconFile: 'ANIME.ico',
      IconIndex: 0,
      InfoTip: anime.name
    },
    'ViewState': {
      Mode: 4,
      Vid: '{137E7700-3573-11CF-AE69-08002B2E1262}',
      FolderType: 'Videos',
      Logo: 'ANIME.jpg'
    },
    'ToUNo-Anime': {
      id: anime.id,
      title_english: anime.title_english,
      title_romaji: anime.title_romaji,
      image: anime.image
    }
  }
  return setINI(file.desktop, iniDesktop);
}

const setINI = (file, content) => {
  let data = new Buffer(ini.stringify(content).replace(/\[\\\./ig, '[.'));
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, data);
    return attrib('+', file);
  } else {
    return attrib('-', file).then(() => {
      fs.writeFileSync(file, data);
      return attrib('+', file);
    })
  }
} 

const getINI = file => {
  let config = ini.parse(fs.readFileSync(file, 'utf-8'));
  return config;
}

module.exports = function() {
  ipc.on('save-anime', function(e, Items){
    let all = Items.map(item => desktop(item));
    async.series(all).then(results => {
      e.sender.send('verify-anime', { success: true })
    }).catch(err => {
      console.log(err);
      e.sender.send('verify-anime', { success: false })
    });

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
      var items = [], totalTime = 0, index = 0;

      let all = fs.readdirSync(anime.source).map(folder_name => {
        return () => {
          let item = {
            index: index,
            verify: true,
            prepare: false,
            anilist: 0,
            anime_id: null,
            name: folder_name,
            path: `${anime.source}\\${folder_name}`,
            files: [],
            anime: {}
          };

          let def = Q.defer(), walker = walk.walk(item.path, {});
          let time = Math.floor(Date.now()), isAnime = false;
          let file = getFile(item.path)


          if (fs.existsSync(file.desktop)) {
            let config = getINI(file.desktop)
            if(config['ToUNo-Anime'].id) isAnime = true;
          }

          if (isAnime) {
            console.log('found anime')
            def.resolve();
          } else {
            index++;
            walker.on("file", function (root, file, next) {
              let ignore = [ 'Desktop.ini', 'ANIME.jpg', 'ANIME.ico' ]
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
          }
          return def.promise;
        }
      })

      async.series(all).then(results => {
        console.log(`Total ${all.length} Tasks Successful (${(totalTime/1000).toFixed(2)}s)`); 
        e.sender.send('list-anime', { found: items.length > 0, items: items });
      });
    } else {
      e.sender.send('list-anime', { found: false, items: [] });
    }

  })
}