import { ipcMain as ipc, dialog } from 'electron'
import { spawn } from 'child_process'
import fs from 'fs'
import ini from 'ini'
import walk from 'walk'
import async from 'async-q'
import Q from 'q'

let getFile = folder => {
  return {
    desktop: `${folder}\\Desktop.ini`,
    image: `${folder}\\ANIME.jpg`
  }
}

const exec = (cmd, arg) => {
  let def = Q.defer()
  let error = false
  const ls = spawn(cmd, arg)
  ls.stderr.on('data', data => {
    error = true
  })
  ls.on('close', (code) => {
    if (code === 0 && !error) { def.resolve(true) } else { def.reject(false) }
  })
  return def.promise
}

const attrib = (arg, file) => {
  return exec('C:/Windows/System32/attrib.exe', [ `${arg}s`, `${arg}h`, file ])
}

const desktop = item => {
  return () => {
    let file = getFile(item.path)

    item.anime.sound = item.anime.sound.join(',')
    item.anime.subtitle = item.anime.subtitle.join(',')
    let iniDesktop = {
      '.ShellClassInfo': {
        ConfirmFileOp: 0,
        NoSharing: 1,
        IconFile: 'ANIME.ico',
        IconIndex: 0,
        InfoTip: item.folder_name
      },
      'ViewState': {
        Mode: 4,
        Vid: '{137E7700-3573-11CF-AE69-08002B2E1262}',
        FolderType: 'Videos',
        Logo: 'ANIME.jpg'
      },
      'App-ToUNo': {
        id: item.id,
        english: item.english,
        romaji: item.romaji,
        status: item.status,
        image: item.image
      },
      'Anime': item.anime
    }
    return setINI(file.desktop, iniDesktop)
  }
}

const setINI = (file, content) => {
  let data = new Buffer(ini.stringify(content).replace(/\[\\\./ig, '[.'))

  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, data)
      return attrib('+', file)
    } else {
      return attrib('-', file).then(() => {
        fs.writeFileSync(file, data)
        return attrib('+', file)
      })
    }
  } catch (e) {
    console.log('setINI', file, e)
    return {}
  }
}

const getINI = file => {
  let config = ini.parse(fs.readFileSync(file, 'utf-8'))
  return config
}

module.exports = function () {
  ipc.on('SERVER_SAVED_ANIME', function (e, Items) {
    let all = Items.map(item => desktop(item))
    async.series(all).then(results => {
      e.sender.send('CLIENT_SAVED_ANIME', { success: true })
    }).catch(err => {
      console.log(err)
      e.sender.send('CLIENT_SAVED_ANIME', { success: false })
    })
  })

  ipc.on('SERVER_GET_FOLDER_ANIME', function (e) {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function (files) {
      e.sender.send('CLIENT_GET_FOLDER_ANIME', files)
    })
  })

  ipc.on('SERVER_GET_LIST_ANIME', function (e, source) {
    if (fs.existsSync(source) && fs.lstatSync(source).isDirectory()) {
      let items = []
      let totalTime = 0
      // let index = 0

      let all = fs.readdirSync(source).map(name => {
        return () => {
          let item = {
            saved: false,
            verify: true,
            prepare: false,
            anilist: 0,
            anime_id: null,
            name: name,
            path: `${source}\\${name}`,
            files: [],
            anime: []
          }

          let def = Q.defer()
          let walker = walk.walk(item.path, {})
          let time = Math.floor(Date.now())
          let isAnime = false
          let file = getFile(item.path)

          if (fs.existsSync(file.desktop)) {
            let config = getINI(file.desktop)
            if (config['App-ToUNo'].id) isAnime = true
          }

          if (isAnime) {
            // console.log('found anime')
            def.resolve()
          } else {
            walker.on('file', function (root, file, next) {
              let ignore = [ 'Desktop.ini', 'ANIME.jpg', 'ANIME.ico' ]
              if (ignore.indexOf(file.name) === -1) {
                let list = {
                  uid: file.uid,
                  name: file.name,
                  size: file.size,
                  ctime: file.ctime
                }
                item.files.push(list)
              }
              next()
            })

            // console.log(`Tasks-${item.name} Begin...`);
            walker.on('errors', function (root, nodeStatsArray, next) {
              // console.log(`error-${root}`);
              next()
            })

            walker.on('end', function () {
              let elapsed = Math.floor(Date.now()) - time
              totalTime += elapsed
              if (item.files.length > 0) {
                // index++
                items.push(item)
              }
              // console.log(`Tasks-${item.name} Successful (${(elapsed/1000).toFixed(2)}s`);
              def.resolve()
            })
          }
          return def.promise
        }
      })

      async.series(all).then(results => {
        console.log(`Total ${all.length} Tasks Successful (${(totalTime / 1000).toFixed(2)}s)`)
        e.sender.send('CLIENT_GET_LIST_ANIME', { found: items.length > 0, items: items })
      })
    } else {
      e.sender.send('CLIENT_GET_LIST_ANIME', { found: false, items: [] })
    }
  })
}
